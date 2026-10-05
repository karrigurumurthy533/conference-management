const nodemailer = require("nodemailer");

// ==========================================
// Nodemailer Transporter
// ==========================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ==========================================
// Send Contact Message
// ==========================================
exports.sendContactMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      organization,
      phone,
      subject,
      message,
    } = req.body;

    // ==========================================
    // Validation
    // ==========================================
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, subject and message are required.",
      });
    }

    // ==========================================
    // Send Email
    // ==========================================
    await transporter.sendMail({
      // Sender
      from: `"GlobalScion Website" <${process.env.SMTP_USER}>`,

      // Receiver
      to: process.env.CONTACT_EMAIL,

      // Visitor email - when you click Reply
      // Gmail will reply directly to visitor
      replyTo: email,

      // Email subject
      subject: `New Contact Form Enquiry - ${subject}`,

      // Email body
      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 700px;
            margin: 0 auto;
            background: #ffffff;
          "
        >

          <!-- Header -->
          <div
            style="
              background: #7c3aed;
              color: #ffffff;
              padding: 24px;
              border-radius: 10px 10px 0 0;
            "
          >
            <h2 style="margin: 0 0 8px 0;">
              New Contact Form Enquiry
            </h2>

            <p style="margin: 0;">
              GlobalScion Website
            </p>
          </div>

          <!-- Content -->
          <div
            style="
              padding: 25px;
              border: 1px solid #e5e7eb;
              border-top: none;
            "
          >

            <p>
              <strong>Name:</strong>
              ${name}
            </p>

            <p>
              <strong>Email:</strong>
              ${email}
            </p>

            <p>
              <strong>Organization:</strong>
              ${organization || "Not provided"}
            </p>

            <p>
              <strong>Phone:</strong>
              ${phone || "Not provided"}
            </p>

            <p>
              <strong>Subject:</strong>
              ${subject}
            </p>

            <!-- Message -->
            <div
              style="
                margin-top: 20px;
                padding: 18px;
                background: #f5f3ff;
                border-left: 4px solid #7c3aed;
              "
            >
              <strong>Message:</strong>

              <p
                style="
                  white-space: pre-wrap;
                  line-height: 1.6;
                  margin-top: 10px;
                "
              >
                ${message}
              </p>
            </div>

          </div>

          <!-- Footer -->
          <p
            style="
              color: #6b7280;
              font-size: 12px;
              text-align: center;
              margin-top: 15px;
            "
          >
            This email was sent from the GlobalScion website
            contact form.
          </p>

        </div>
      `,
    });

    // ==========================================
    // Success Response
    // ==========================================
    return res.status(200).json({
      success: true,
      message: "Message sent successfully.",
    });

  } catch (error) {
    console.error("Contact email error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to send message. Please try again later.",
    });
  }
};