
const nodemailer = require("nodemailer");
const dns = require("node:dns");

dns.setDefaultResultOrder("ipv4first");

const smtpPort = Number(process.env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpPort === 465,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 30000,

  tls: {
    minVersion: "TLSv1.2",
  },
});

const sendEmployeeCredentials = async ({
  name,
  email,
  password,
  employeeType,
}) => {
  const loginUrl =
    process.env.EMPLOYEE_LOGIN_URL ||
    "http://localhost:5173/employee/login";

  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error("SMTP environment variables are missing");
  }

  console.log("[EMAIL] Verifying SMTP connection...");

  try {
    await transporter.verify();
    console.log("[EMAIL] SMTP connection verified");

    const info = await transporter.sendMail({
      from: `"GlobalScion" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your GlobalScion Employee Account",

      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>GlobalScion Employee Account</title>
          </head>

          <body style="margin:0;padding:30px 15px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
            <div style="max-width:650px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              <div style="background:#7c3aed;padding:28px;color:#fff;">
                <h2 style="margin:0 0 8px;font-size:22px;">Welcome to GlobalScion</h2>
                <p style="margin:0;font-size:14px;">Your employee account has been created</p>
              </div>

              <div style="padding:30px;">
                <p style="font-size:15px;color:#374151;">
                  Hello <strong>${escapeHtml(name)}</strong>,
                </p>

                <p style="color:#4b5563;line-height:1.6;font-size:14px;">
                  Your GlobalScion employee account has been successfully created.
                  Use the details below to access your employee dashboard.
                </p>

                <div style="margin-top:25px;padding:20px;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:10px;">
                  <p style="margin:0 0 12px;color:#374151;font-size:14px;">
                    <strong>Email:</strong> ${escapeHtml(email)}
                  </p>

                  <p style="margin:0 0 12px;color:#374151;font-size:14px;">
                    <strong>Employee Type:</strong> ${escapeHtml(employeeType || "Employee")}
                  </p>

                  <p style="margin:0;color:#374151;font-size:14px;">
                    <strong>Password:</strong> ${escapeHtml(password || "Use the secure password setup process.")}
                  </p>
                </div>

                <div style="margin-top:28px;text-align:center;">
                  <a href="${escapeHtml(loginUrl)}"
                    style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:bold;">
                    Login to Employee Dashboard
                  </a>
                </div>

                <div style="margin-top:25px;padding:15px;background:#fff7ed;border-left:4px solid #f97316;border-radius:4px;">
                  <p style="margin:0;color:#9a3412;font-size:12px;line-height:1.6;">
                    For security, use a secure password setup process and never share your password.
                  </p>
                </div>
              </div>

              <div style="padding:16px 25px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
                <p style="margin:0;color:#9ca3af;font-size:12px;">GlobalScion</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("[EMAIL] Email accepted:", info.messageId);

    return info;
  } catch (error) {
    console.error("[EMAIL] Nodemailer error:", {
      code: error.code,
      command: error.command,
      message: error.message,
    });

    throw error;
  }
};

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

module.exports = {
  transporter,
  sendEmployeeCredentials,
};
