const {
  contactTransporter,
} = require("../utils/contactMailer");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* =========================================================
   HTML ESCAPE
========================================================= */

const escapeHtml = (value = "") => {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return String(value).replace(/[&<>"']/g, (char) => entities[char]);
};

/* =========================================================
   CONTACT EMAIL HTML TEMPLATE
========================================================= */

const getContactEmailTemplate = ({
  name,
  email,
  organization,
  phone,
  subject,
  message,
}) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeOrganization = escapeHtml(organization || "Not provided");
  const safePhone = escapeHtml(phone || "Not provided");
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\r\n|\r|\n/g, "<br>");

  const currentYear = new Date().getFullYear();

  const detailRow = (label, value) => `
    <tr>
      <td width="135"
        style="width:135px;padding:12px;background-color:#F3EEFF;border-bottom:1px solid #E8DEFF;color:#5B21B6;font-size:13px;font-weight:bold;vertical-align:top;">
        ${label}
      </td>
      <td
        style="padding:12px;background-color:#FFFFFF;border-bottom:1px solid #E8DEFF;color:#30234A;font-size:14px;line-height:1.7;overflow-wrap:anywhere;">
        ${value}
      </td>
    </tr>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>New Contact Enquiry | GlobalScion Conferences</title>
</head>

<body bgcolor="#F3EEFF"
  style="margin:0;padding:0;background-color:#F3EEFF;font-family:Arial,Helvetica,sans-serif;color:#30234A;">

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"
    bgcolor="#F3EEFF"
    style="width:100%;background-color:#F3EEFF;padding:30px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0"
          bgcolor="#FFFFFF"
          style="width:100%;max-width:600px;background-color:#FFFFFF;border:1px solid #E4D7FF;border-radius:12px;overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td align="center" bgcolor="#6D28D9"
              style="background-color:#6D28D9;padding:30px 20px;">

              <h1 style="margin:0;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:25px;line-height:1.4;font-weight:bold;">
                GlobalScion Conferences
              </h1>

              <p style="margin:9px 0 0;color:#F3E8FF;font-size:13px;line-height:1.6;">
                Connecting Knowledge. Inspiring Innovation.
              </p>

              <table role="presentation" border="0" cellspacing="0" cellpadding="0"
                style="margin-top:18px;">
                <tr>
                  <td bgcolor="#8B5CF6"
                    style="background-color:#8B5CF6;border-radius:20px;padding:7px 16px;">
                    <span style="color:#FFFFFF;font-size:11px;font-weight:bold;letter-spacing:1px;">
                      NEW CONTACT ENQUIRY
                    </span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td bgcolor="#FFFFFF"
              style="background-color:#FFFFFF;padding:30px 25px;">

              <h2 style="margin:0 0 12px;color:#6D28D9;font-size:22px;line-height:1.4;">
                Contact Form Enquiry
              </h2>

              <p style="margin:0 0 24px;color:#514563;font-size:14px;line-height:1.8;">
                A new enquiry has been submitted through the GlobalScion Conferences website.
                Please find the contact details below.
              </p>

              <!-- CONTACT DETAILS -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"
                style="width:100%;border:1px solid #E8DEFF;border-collapse:collapse;">

                ${detailRow("Full Name", safeName)}
                ${detailRow("Email Address", safeEmail)}
                ${detailRow("Organization", safeOrganization)}
                ${detailRow("Phone Number", safePhone)}
                ${detailRow("Subject", safeSubject)}

              </table>

              <!-- MESSAGE -->
              <h3 style="margin:28px 0 12px;color:#6D28D9;font-size:17px;">
                Message Details
              </h3>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"
                style="width:100%;border-collapse:collapse;">
                <tr>
                  <td bgcolor="#FAF8FF"
                    style="background-color:#FAF8FF;border-left:4px solid #7C3AED;padding:18px;color:#514563;font-size:14px;line-height:1.9;overflow-wrap:anywhere;">
                    ${safeMessage}
                  </td>
                </tr>
              </table>

              <p style="margin:26px 0 0;color:#514563;font-size:13px;line-height:1.8;">
                You can reply directly to this email to respond to the sender.
              </p>

              <p style="margin:22px 0 0;color:#514563;font-size:14px;line-height:1.8;">
                Best regards,<br>
                <strong style="color:#6D28D9;">GlobalScion Conferences Team</strong>
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" bgcolor="#EDE5FF"
              style="background-color:#EDE5FF;border-top:1px solid #DCCBFF;padding:22px 18px;">

              <p style="margin:0 0 8px;color:#5B21B6;font-size:13px;font-weight:bold;">
                GlobalScion Conferences
              </p>

              <p style="margin:0;color:#625775;font-size:11px;line-height:1.8;">
                This email contains an enquiry submitted through our website.
              </p>

              <p style="margin:10px 0 0;color:#625775;font-size:11px;">
                &copy; ${currentYear} GlobalScion Conferences. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};

/* =========================================================
   SEND CONTACT MESSAGE
========================================================= */

exports.sendContactMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      organization,
      phone,
      subject,
      message,
    } = req.body || {};

    // 1. Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject and message are required.",
      });
    }

    // 2. Normalize input
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    const cleanOrganization =
      typeof organization === "string"
        ? organization.trim()
        : "";

    const cleanPhone =
      typeof phone === "string"
        ? phone.trim()
        : "";

    // 3. Validate field lengths
    if (
      cleanName.length > 100 ||
      cleanEmail.length > 254 ||
      cleanOrganization.length > 200 ||
      cleanPhone.length > 30 ||
      cleanSubject.length > 200 ||
      cleanMessage.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields exceed the allowed length.",
      });
    }

    // 4. Validate email
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // 5. Validate SMTP configuration
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.CONTACT_EMAIL
    ) {
      console.error("Contact email configuration is missing.");

      return res.status(500).json({
        success: false,
        message: "Email service is temporarily unavailable.",
      });
    }

    // 6. Prepare email
    const mailOptions = {
      from: `"GlobalScion Conferences" <${process.env.SMTP_USER}>`,

      to: process.env.CONTACT_EMAIL,

      replyTo: {
        name: cleanName,
        address: cleanEmail,
      },

      subject: `GlobalScion Conferences | ${cleanSubject}`,

      // Plain-text fallback for email clients that do not support HTML
      text: [
        "GlobalScion Conferences - Contact Enquiry",
        "",
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        `Organization: ${cleanOrganization || "Not provided"}`,
        `Phone: ${cleanPhone || "Not provided"}`,
        `Subject: ${cleanSubject}`,
        "",
        "Message:",
        cleanMessage,
      ].join("\n"),

      // Branded HTML email
      html: getContactEmailTemplate({
        name: cleanName,
        email: cleanEmail,
        organization: cleanOrganization,
        phone: cleanPhone,
        subject: cleanSubject,
        message: cleanMessage,
      }),
    };

    // 7. Send email
    const info = await contactTransporter.sendMail(mailOptions);

    console.info("Contact email accepted by SMTP:", {
      messageId: info.messageId,
    });

    // 8. Success response
    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact email error:", {
      code: error.code,
      command: error.command,
      message: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to send your message. Please try again later.",
    });
  }
};