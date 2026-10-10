
const crypto = require("crypto");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");

const Payment = require("../models/Payment");
const Registration = require("../models/Registration");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const validObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

/*
 * CREATE RAZORPAY ORDER
 * POST /api/v1/payments/order
 *
 * The amount and conference details are loaded from
 * the registration record, not trusted from the client.
 */
exports.createPaymentOrder = asyncHandler(async (req, res) => {
  const { registrationId } = req.body;

  if (!registrationId || !validObjectId(registrationId)) {
    return res.status(400).json({
      success: false,
      message: "Valid registrationId is required",
    });
  }

  const registration = await Registration.findById(registrationId);

  if (!registration) {
    return res.status(404).json({
      success: false,
      message: "Registration not found",
    });
  }

  /*
   * ADAPT THESE MAPPINGS to your actual Registration model.
   * Never accept the payable amount directly from the client.
   */
  const payerName =
    registration.fullName ||
    registration.name ||
    registration.user?.name;

  const payerEmail =
    registration.email ||
    registration.user?.email;

  const payerPhone =
    registration.phone ||
    registration.phoneNumber ||
    registration.user?.phone;

  const conferenceId =
    registration.conference?.conferenceId ||
    registration.conferenceId;

  const conferenceTitle =
    registration.conference?.title ||
    registration.conferenceTitle;

  const amount =
    Number(
      registration.amount ??
      registration.registrationFee ??
      registration.price
    );

  const currency = String(
    registration.currency || "INR"
  ).toUpperCase();

  if (
    !payerName ||
    !payerEmail ||
    !payerPhone ||
    !conferenceId ||
    !conferenceTitle ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Registration is missing required payer, conference, or amount details",
    });
  }

  if (currency !== "INR") {
    return res.status(400).json({
      success: false,
      message:
        "This Razorpay order endpoint currently supports INR only",
    });
  }

  const existingPaidPayment = await Payment.findOne({
    registrationId,
    paymentStatus: "Paid",
  });

  if (existingPaidPayment) {
    return res.status(409).json({
      success: false,
      message: "This registration is already paid",
    });
  }

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt: `reg_${registration._id}`,
    notes: {
      registrationId: String(registration._id),
      conferenceId: String(conferenceId),
    },
  });

  const payment = await Payment.create({
    registrationId: registration._id,
    conferenceId,
    conferenceTitle,
    payer: {
      name: payerName,
      email: payerEmail,
      phone: payerPhone,
    },
    amount,
    currency,
    razorpay: {
      orderId: order.id,
    },
    paymentStatus: "Pending",
  });

  return res.status(201).json({
    success: true,
    message: "Payment order created successfully",
    data: {
      paymentId: payment._id,
      registrationId: payment.registrationId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    },
  });
});

/*
 * VERIFY RAZORPAY PAYMENT
 * POST /api/v1/payments/verify
 */
exports.verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return res.status(400).json({
      success: false,
      message: "Razorpay verification fields are required",
    });
  }

  const payment = await Payment.findOne({
    "razorpay.orderId": razorpay_order_id,
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment order not found",
    });
  }

  if (payment.paymentStatus === "Paid") {
    if (
      payment.razorpay.paymentId === razorpay_payment_id
    ) {
      return res.json({
        success: true,
        message: "Payment was already verified",
        data: payment,
      });
    }

    return res.status(409).json({
      success: false,
      message: "Order has already been paid with another payment",
    });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const supplied = Buffer.from(razorpay_signature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  const signatureValid =
    supplied.length === expected.length &&
    crypto.timingSafeEqual(supplied, expected);

  if (!signatureValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });
  }

  /*
   * Fetch the payment from Razorpay.
   * Do not mark the transaction Paid based on signature alone.
   */
  const razorpayPayment = await razorpay.payments.fetch(
    razorpay_payment_id
  );

  if (razorpayPayment.order_id !== razorpay_order_id) {
    return res.status(400).json({
      success: false,
      message: "Payment does not belong to this order",
    });
  }

  if (
    razorpayPayment.status !== "captured" ||
    razorpayPayment.amount !== Math.round(payment.amount * 100) ||
    razorpayPayment.currency !== payment.currency
  ) {
    return res.status(409).json({
      success: false,
      message:
        "Payment is not captured or its amount/currency does not match",
      data: {
        razorpayStatus: razorpayPayment.status,
      },
    });
  }

  payment.razorpay.paymentId = razorpay_payment_id;
  payment.razorpay.signature = razorpay_signature;
  payment.paymentMethod = razorpayPayment.method || null;
  payment.paymentStatus = "Paid";
  payment.transactionId = razorpay_payment_id;
  payment.paidAt = new Date();
  payment.razorpayData = razorpayPayment;

  await payment.save();

  return res.json({
    success: true,
    message: "Payment verified successfully",
    data: payment,
  });
});

/*
 * ADMIN DASHBOARD SUMMARY
 * GET /api/v1/payments/admin/summary
 */
exports.getPaymentSummary = asyncHandler(async (req, res) => {
  const summary = await Payment.aggregate([
    {
      $group: {
        _id: null,

        totalRevenue: {
          $sum: {
            $cond: [
              { $eq: ["$paymentStatus", "Paid"] },
              "$amount",
              0,
            ],
          },
        },

        successfulPayments: {
          $sum: {
            $cond: [
              { $eq: ["$paymentStatus", "Paid"] },
              1,
              0,
            ],
          },
        },

        pendingPayments: {
          $sum: {
            $cond: [
              {
                $in: [
                  "$paymentStatus",
                  ["Created", "Pending"],
                ],
              },
              1,
              0,
            ],
          },
        },

        failedPayments: {
          $sum: {
            $cond: [
              { $eq: ["$paymentStatus", "Failed"] },
              1,
              0,
            ],
          },
        },

        refundedPayments: {
          $sum: {
            $cond: [
              { $eq: ["$paymentStatus", "Refunded"] },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  return res.json({
    success: true,
    data: summary[0] || {
      totalRevenue: 0,
      successfulPayments: 0,
      pendingPayments: 0,
      failedPayments: 0,
      refundedPayments: 0,
    },
  });
});

/*
 * ADMIN PAYMENT LIST
 * GET /api/v1/payments/admin?page=1&limit=10&search=rahul&status=Paid
 */
exports.getPayments = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(req.query.limit) || 10)
  );

  const { search, status, conferenceId, method } = req.query;

  const filter = {};

  if (status) {
    const allowedStatuses = [
      "Created",
      "Pending",
      "Paid",
      "Failed",
      "Refunded",
      "Partially Refunded",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    filter.paymentStatus = status;
  }

  if (conferenceId) {
    if (!validObjectId(conferenceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conferenceId",
      });
    }

    filter.conferenceId = conferenceId;
  }

  if (method) {
    filter.paymentMethod = {
      $regex: `^${method.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      $options: "i",
    };
  }

  if (search?.trim()) {
    const escapedSearch = search.trim().replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(escapedSearch, "i");

    const searchConditions = [
      { conferenceTitle: regex },
      { "payer.name": regex },
      { "payer.email": regex },
      { "razorpay.paymentId": regex },
      { "razorpay.orderId": regex },
      { transactionId: regex },
    ];

    if (validObjectId(search.trim())) {
      searchConditions.push({
        _id: new mongoose.Types.ObjectId(search.trim()),
      });
    }

    filter.$or = searchConditions;
  }

  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Payment.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    count: payments.length,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: payments,
  });
});

/*
 * PAYMENT DETAILS
 * GET /api/v1/payments/admin/:id
 */
exports.getPaymentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment ID",
    });
  }

  const payment = await Payment.findById(id).lean();

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    });
  }

  return res.json({
    success: true,
    data: payment,
  });
});

/*
 * SYNC PAYMENT STATUS FROM RAZORPAY
 * GET /api/v1/payments/admin/:id/sync
 */
exports.syncPaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment ID",
    });
  }

  const payment = await Payment.findById(id);

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    });
  }

  const order = await razorpay.orders.fetch(
    payment.razorpay.orderId
  );

  const razorpayPayments = await razorpay.orders.fetchPayments(
    payment.razorpay.orderId
  );

  const items = razorpayPayments.items || [];

  const captured = items.find(
    (item) =>
      item.status === "captured" &&
      item.amount === Math.round(payment.amount * 100) &&
      item.currency === payment.currency
  );

  if (captured) {
    payment.razorpay.paymentId = captured.id;
    payment.paymentMethod = captured.method || null;
    payment.paymentStatus = "Paid";
    payment.transactionId = captured.id;
    payment.paidAt = captured.created_at
      ? new Date(captured.created_at * 1000)
      : new Date();
    payment.razorpayData = captured;
  } else if (
    order.status === "paid" &&
    payment.paymentStatus !== "Paid"
  ) {
    return res.status(409).json({
      success: false,
      message:
        "Razorpay order is paid, but a matching captured payment was not found. Reconcile this transaction before updating it.",
    });
  } else if (
    items.some((item) => item.status === "failed")
  ) {
    payment.paymentStatus = "Failed";
  } else if (
    order.status === "created"
  ) {
    payment.paymentStatus = "Pending";
  }

  await payment.save();

  return res.json({
    success: true,
    message: "Payment status synchronized",
    data: payment,
  });
});

/*
 * REFUND PAYMENT
 * POST /api/v1/payments/admin/:id/refund
 *
 * Body: { amount: 50 }
 * Omit amount to refund the remaining amount.
 */
exports.refundPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const requestedAmount =
    req.body.amount === undefined
      ? null
      : Number(req.body.amount);

  if (!validObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment ID",
    });
  }

  const payment = await Payment.findById(id);

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    });
  }

  if (
    payment.paymentStatus !== "Paid" &&
    payment.paymentStatus !== "Partially Refunded"
  ) {
    return res.status(400).json({
      success: false,
      message: "Only paid payments can be refunded",
    });
  }

  if (!payment.razorpay.paymentId) {
    return res.status(400).json({
      success: false,
      message: "Razorpay payment ID is missing",
    });
  }

  if (
    requestedAmount !== null &&
    (!Number.isFinite(requestedAmount) ||
      requestedAmount <= 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "Refund amount must be greater than zero",
    });
  }

  const existingRefunds = await razorpay.payments.fetchMultipleRefund(
    payment.razorpay.paymentId
  );

  const refundItems = existingRefunds.items || [];

  const refundedPaise = refundItems
    .filter((refund) => refund.status !== "failed")
    .reduce((total, refund) => total + refund.amount, 0);

  const totalPaise = Math.round(payment.amount * 100);
  const remainingPaise = totalPaise - refundedPaise;

  if (remainingPaise <= 0) {
    return res.status(400).json({
      success: false,
      message: "This payment has already been fully refunded",
    });
  }

  const refundPaise =
    requestedAmount === null
      ? remainingPaise
      : Math.round(requestedAmount * 100);

  if (refundPaise > remainingPaise) {
    return res.status(400).json({
      success: false,
      message: "Refund amount exceeds the remaining refundable amount",
    });
  }

  const refund = await razorpay.payments.refund(
    payment.razorpay.paymentId,
    {
      amount: refundPaise,
      notes: {
        internalPaymentId: String(payment._id),
      },
    }
  );

  const updatedRefundedPaise =
    refundedPaise +
    (refund.status === "failed" ? 0 : refund.amount);

  if (updatedRefundedPaise >= totalPaise) {
    payment.paymentStatus = "Refunded";
  } else if (updatedRefundedPaise > 0) {
    payment.paymentStatus = "Partially Refunded";
  }

  payment.razorpayData = {
    ...(payment.razorpayData || {}),
    latestRefund: refund,
  };

  await payment.save();

  return res.json({
    success: true,
    message: "Refund request submitted to Razorpay",
    data: {
      payment,
      refund,
    },
  });
});
