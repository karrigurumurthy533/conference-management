const crypto = require("crypto");

const razorpay = require("../config/razorpay");

const Registration = require("../models/Registration");
const Payment = require("../models/Payment");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

/*
|--------------------------------------------------------------------------
| CREATE PAYMENT ORDER
|--------------------------------------------------------------------------
*/

exports.createPaymentOrder = catchAsync(
  async (req, res, next) => {
    const { registrationId } = req.body;

    // ------------------------------------------------
    // 1. Validate registration ID
    // ------------------------------------------------

    if (!registrationId) {
      return next(
        new AppError(
          "Registration ID is required",
          400
        )
      );
    }

    // ------------------------------------------------
    // 2. Find registration
    // ------------------------------------------------

    const registration =
      await Registration.findById(registrationId);

    if (!registration) {
      return next(
        new AppError(
          "Registration not found",
          404
        )
      );
    }

    // ------------------------------------------------
    // 3. Already paid check
    // ------------------------------------------------

    if (
      registration.paymentStatus === "Paid"
    ) {
      return next(
        new AppError(
          "Registration is already paid",
          400
        )
      );
    }

    // ------------------------------------------------
    // 4. Get original registration price
    // ------------------------------------------------

    const price = Number(
      registration.registration?.price
    );

    const currency =
      registration.registration?.currency
        ?.toString()
        .trim()
        .toUpperCase();

    console.log(
      "========================================"
    );

    console.log(
      "CREATE PAYMENT ORDER"
    );

    console.log(
      "Registration ID:",
      registration._id.toString()
    );

    console.log(
      "Registration Price:",
      registration.registration?.price
    );

    console.log(
      "Registration Currency:",
      registration.registration?.currency
    );

    console.log(
      "Normalized Price:",
      price
    );

    console.log(
      "Normalized Currency:",
      currency
    );

    console.log(
      "========================================"
    );

    // ------------------------------------------------
    // 5. Validate price
    // ------------------------------------------------

    if (!price || price <= 0) {
      return next(
        new AppError(
          "Invalid registration amount",
          400
        )
      );
    }

    // ------------------------------------------------
    // 6. Validate currency
    // ------------------------------------------------

    const supportedCurrencies = [
      "GBP",
      "USD",
      "EUR",
    ];

    if (
      !currency ||
      !supportedCurrencies.includes(currency)
    ) {
      return next(
        new AppError(
          `Unsupported payment currency: ${currency}`,
          400
        )
      );
    }

    const paymentCurrency = currency;

    // ------------------------------------------------
    // 7. Convert to smallest currency unit
    //
    // GBP 100 -> 10000 pence
    // USD 100 -> 10000 cents
    // EUR 100 -> 10000 cents
    //
    // IMPORTANT:
    // NO INR CONVERSION
    // ------------------------------------------------

    const razorpayAmount = Math.round(
      price * 100
    );

    if (razorpayAmount <= 0) {
      return next(
        new AppError(
          "Invalid Razorpay payment amount",
          400
        )
      );
    }

    // ------------------------------------------------
    // 8. Razorpay order options
    // ------------------------------------------------

    const options = {
      amount: razorpayAmount,

      // IMPORTANT:
      // Original currency only.
      // Never change this to INR.
      currency: paymentCurrency,

      receipt: `REG_${registration._id}`,
    };

    console.log(
      "========================================"
    );

    console.log(
      "RAZORPAY ORDER OPTIONS"
    );

    console.log(
      "Amount:",
      options.amount
    );

    console.log(
      "Currency:",
      options.currency
    );

    console.log(
      "Receipt:",
      options.receipt
    );

    console.log(
      "========================================"
    );

    // ------------------------------------------------
    // 9. Create Razorpay order
    // ------------------------------------------------

    let order;

    try {
      order =
        await razorpay.orders.create(
          options
        );
    } catch (error) {
      console.error(
        "========================================"
      );

      console.error(
        "RAZORPAY ORDER CREATION ERROR"
      );

      console.error(
        error
      );

      console.error(
        "========================================"
      );

      return next(
        new AppError(
          error?.error?.description ||
            error?.description ||
            "Unable to create Razorpay payment order",
          400
        )
      );
    }

    // ------------------------------------------------
    // 10. Log Razorpay response
    // ------------------------------------------------

    console.log(
      "========================================"
    );

    console.log(
      "RAZORPAY ORDER CREATED"
    );

    console.log(
      "Order ID:",
      order.id
    );

    console.log(
      "Order Amount:",
      order.amount
    );

    console.log(
      "Order Currency:",
      order.currency
    );

    console.log(
      "========================================"
    );

    // ------------------------------------------------
    // 11. Safety check
    //
    // Make sure Razorpay did not return
    // a different currency.
    // ------------------------------------------------

    if (
      order.currency !== paymentCurrency
    ) {
      return next(
        new AppError(
          `Razorpay currency mismatch. Expected ${paymentCurrency}, received ${order.currency}`,
          400
        )
      );
    }

    // ------------------------------------------------
    // 12. Save Razorpay order ID
    // ------------------------------------------------

    registration.paymentOrderId =
      order.id;

    registration.paymentStatus =
      "Pending";

    await registration.save();

    // ------------------------------------------------
    // 13. Send response
    // ------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Payment order created successfully",

      data: {
        orderId:
          order.id,

        // Razorpay smallest unit
        amount:
          order.amount,

        // GBP / USD / EUR
        currency:
          order.currency,

        keyId:
          process.env.RAZORPAY_KEY_ID,

        registrationId:
          registration._id,

        // Original amount for UI
        displayAmount:
          price,

        // Original currency for UI
        displayCurrency:
          paymentCurrency,
      },
    });
  }
);


/*
|--------------------------------------------------------------------------
| VERIFY PAYMENT
|--------------------------------------------------------------------------
*/

exports.verifyPayment = catchAsync(
  async (req, res, next) => {
    const {
      registrationId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // ------------------------------------------------
    // 1. Validate request
    // ------------------------------------------------

    if (
      !registrationId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return next(
        new AppError(
          "Payment details are required",
          400
        )
      );
    }

    // ------------------------------------------------
    // 2. Find registration
    // ------------------------------------------------

    const registration =
      await Registration.findById(
        registrationId
      );

    if (!registration) {
      return next(
        new AppError(
          "Registration not found",
          404
        )
      );
    }

    // ------------------------------------------------
    // 3. Verify Razorpay order ID
    // ------------------------------------------------

    if (
      registration.paymentOrderId !==
      razorpay_order_id
    ) {
      return next(
        new AppError(
          "Invalid payment order",
          400
        )
      );
    }

    // ------------------------------------------------
    // 4. Generate Razorpay signature
    // ------------------------------------------------

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    // ------------------------------------------------
    // 5. Verify signature
    // ------------------------------------------------

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      registration.paymentStatus =
        "Failed";

      await registration.save();

      return next(
        new AppError(
          "Payment verification failed",
          400
        )
      );
    }

    // ------------------------------------------------
    // 6. Check duplicate payment
    // ------------------------------------------------

    const existingPayment =
      await Payment.findOne({
        "razorpay.paymentId":
          razorpay_payment_id,
      });

    if (existingPayment) {
      return res.status(200).json({
        success: true,

        message:
          "Payment already verified",

        data: {
          payment:
            existingPayment,
        },
      });
    }

    // ------------------------------------------------
    // 7. Fetch payment from Razorpay
    // ------------------------------------------------

    let razorpayPayment;

    try {
      razorpayPayment =
        await razorpay.payments.fetch(
          razorpay_payment_id
        );
    } catch (error) {
      console.error(
        "Razorpay payment fetch error:",
        error
      );

      return next(
        new AppError(
          "Unable to fetch Razorpay payment details",
          500
        )
      );
    }

    // ------------------------------------------------
    // 8. Verify order ID
    // ------------------------------------------------

    if (
      razorpayPayment.order_id !==
      razorpay_order_id
    ) {
      return next(
        new AppError(
          "Payment does not belong to this order",
          400
        )
      );
    }

    // ------------------------------------------------
    // 9. Verify payment status
    // ------------------------------------------------

    if (
      razorpayPayment.status !==
      "captured"
    ) {
      registration.paymentStatus =
        "Failed";

      await registration.save();

      return next(
        new AppError(
          `Payment is not captured. Current status: ${razorpayPayment.status}`,
          400
        )
      );
    }

    // ------------------------------------------------
    // 10. Get expected price
    // ------------------------------------------------

    const expectedPrice =
      Number(
        registration.registration?.price
      );

    // ------------------------------------------------
    // 11. Get expected currency
    // ------------------------------------------------

    const expectedCurrency =
      registration.registration?.currency
        ?.toString()
        .trim()
        .toUpperCase();

    // ------------------------------------------------
    // 12. Validate expected price
    // ------------------------------------------------

    if (
      !expectedPrice ||
      expectedPrice <= 0
    ) {
      return next(
        new AppError(
          "Invalid registration amount",
          400
        )
      );
    }

    // ------------------------------------------------
    // 13. Validate expected currency
    // ------------------------------------------------

    const supportedCurrencies = [
      "GBP",
      "USD",
      "EUR",
    ];

    if (
      !supportedCurrencies.includes(
        expectedCurrency
      )
    ) {
      return next(
        new AppError(
          `Unsupported payment currency: ${expectedCurrency}`,
          400
        )
      );
    }

    // ------------------------------------------------
    // 14. Calculate expected Razorpay amount
    // ------------------------------------------------

    const expectedAmount =
      Math.round(
        expectedPrice * 100
      );

    // ------------------------------------------------
    // 15. Verify payment amount
    // ------------------------------------------------

    if (
      Number(
        razorpayPayment.amount
      ) !== expectedAmount
    ) {
      console.error(
        "Payment amount mismatch:",
        {
          expected:
            expectedAmount,

          received:
            razorpayPayment.amount,
        }
      );

      return next(
        new AppError(
          `Payment amount mismatch. Expected ${expectedAmount}, received ${razorpayPayment.amount}`,
          400
        )
      );
    }

    // ------------------------------------------------
    // 16. Verify payment currency
    // ------------------------------------------------

    const razorpayCurrency =
      razorpayPayment.currency
        ?.toString()
        .trim()
        .toUpperCase();

    if (
      razorpayCurrency !==
      expectedCurrency
    ) {
      console.error(
        "Payment currency mismatch:",
        {
          expected:
            expectedCurrency,

          received:
            razorpayCurrency,
        }
      );

      return next(
        new AppError(
          `Payment currency mismatch. Expected ${expectedCurrency}, received ${razorpayCurrency}`,
          400
        )
      );
    }

    // ------------------------------------------------
    // 17. Build payer name
    // ------------------------------------------------

    const payerName = [
      registration.title,
      registration.firstName,
      registration.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    // ------------------------------------------------
    // 18. Conference information
    // ------------------------------------------------

    const conferenceId =
      registration.conference
        ?.conferenceId ||
      registration.conference?._id;

    const conferenceTitle =
      registration.conference
        ?.conferenceTitle ||
      registration.conference?.title ||
      "Conference";

    // ------------------------------------------------
    // 19. Update Registration
    // ------------------------------------------------

    registration.paymentId =
      razorpay_payment_id;

    registration.paymentSignature =
      razorpay_signature;

    registration.paymentStatus =
      "Paid";

    registration.status =
      "Confirmed";

    await registration.save();

    // ------------------------------------------------
    // 20. Create Payment record
    // ------------------------------------------------

    const payment =
      await Payment.create({
        registrationId:
          registration._id,

        conferenceId:
          conferenceId,

        conferenceTitle:
          conferenceTitle,

        // --------------------------------------------
        // Payer
        // --------------------------------------------

        payer: {
          name:
            payerName,

          email:
            registration.email,

          phone:
            registration.phone,
        },

        // --------------------------------------------
        // Amount
        // --------------------------------------------

        amount:
          expectedPrice,

        currency:
          expectedCurrency,

        // --------------------------------------------
        // Original amount
        //
        // No conversion was performed.
        // --------------------------------------------

        originalAmount:
          expectedPrice,

        originalCurrency:
          expectedCurrency,

        // --------------------------------------------
        // Razorpay details
        // --------------------------------------------

        razorpay: {
          orderId:
            razorpay_order_id,

          paymentId:
            razorpay_payment_id,

          signature:
            razorpay_signature,
        },

        // --------------------------------------------
        // Payment method
        // --------------------------------------------

        paymentMethod:
          razorpayPayment.method ||
          null,

        // --------------------------------------------
        // Payment status
        // --------------------------------------------

        paymentStatus:
          "Paid",

        // --------------------------------------------
        // Transaction ID
        // --------------------------------------------

        transactionId:
          razorpay_payment_id,

        // --------------------------------------------
        // Paid time
        // --------------------------------------------

        paidAt:
          new Date(),

        // --------------------------------------------
        // Full Razorpay payment data
        // --------------------------------------------

        razorpayData:
          razorpayPayment,
      });

    // ------------------------------------------------
    // 21. Final response
    // ------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Payment verified and transaction saved successfully",

      data: {
        registration:
          registration,

        payment:
          payment,
      },
    });
  }
);