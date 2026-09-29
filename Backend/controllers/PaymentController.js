const crypto = require("crypto");

const razorpay = require("../config/razorpay");

const Registration = require("../models/Registration");

const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/AppError");

exports.createPaymentOrder = catchAsync(async (req, res, next) => {
  const { registrationId } = req.body;

  if (!registrationId) {
    return next(new AppError("Registration ID is required", 400));
  }

  const registration = await Registration.findById(registrationId);

  if (!registration) {
    return next(new AppError("Registration not found", 404));
  }

  if (registration.paymentStatus === "Paid") {
    return next(new AppError("Registration is already paid", 400));
  }

  const amount = Math.round(
    registration.registration.price * 100
  );

  const currency = registration.registration.currency || "INR";

  const options = {
    amount,
    currency,
    receipt: `REG_${registration._id}`,
  };

  const order = await razorpay.orders.create(options);

  registration.paymentOrderId = order.id;

  await registration.save();

  res.status(200).json({
    success: true,
    message: "Payment order created successfully",
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      registrationId: registration._id,
    },
  });
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
  const {
    registrationId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (
    !registrationId ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return next(new AppError("Payment details are required", 400));
  }

  const registration = await Registration.findById(registrationId);

  if (!registration) {
    return next(new AppError("Registration not found", 404));
  }

  if (registration.paymentOrderId !== razorpay_order_id) {
    return next(new AppError("Invalid payment order", 400));
  }

  const generatedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      `${razorpay_order_id}|${razorpay_payment_id}`
    )
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    registration.paymentStatus = "Failed";

    await registration.save();

    return next(new AppError("Payment verification failed", 400));
  }

  registration.paymentId = razorpay_payment_id;
  registration.paymentSignature = razorpay_signature;
  registration.paymentStatus = "Paid";
  registration.status = "Confirmed";

  await registration.save();

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    data: registration,
  });
});