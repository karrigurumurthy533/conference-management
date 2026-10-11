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

  pool: true,
  maxConnections: 2,
  maxMessages: 100,

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,

  tls: {
    minVersion: "TLSv1.2",
  },
});

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

const sendEmployeeCredentials = async ({
  name,
  email,
  employeeType,
  password,
  loginUrl,
}) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP credentials are missing");
  }

  const employeeLoginUrl =
    loginUrl || process.env.EMPLOYEE_LOGIN_URL;

  if (!employeeLoginUrl) {
    throw new Error("EMPLOYEE_LOGIN_URL is not configured");
  }

  const info = await transporter.sendMail({
    from: `"GlobalScion" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your GlobalScion Employee Account",

    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#333">
        <div style="background:#7c3aed;padding:24px;text-align:center;border-radius:10px 10px 0 0">
          <h1 style="color:white;margin:0">GlobalScion</h1>
          <p style="color:white;margin-bottom:0">Employee Account Information</p>
        </div>

        <div style="padding:24px;border:1px solid #eee;border-radius:0 0 10px 10px">
          <h2>Welcome, ${escapeHtml(name || "Employee")}!</h2>

          <p>Your employee account information is ready.</p>

          <p><strong>Name:</strong> ${escapeHtml(name || "")}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Employee Type:</strong> ${escapeHtml(employeeType || "Employee")}</p>

          <p>Use the button below to access the employee portal.</p>

          <p style="text-align:center;margin:28px 0">
            <a href="${escapeHtml(employeeLoginUrl)}"
              style="background:#7c3aed;color:#fff;padding:13px 24px;text-decoration:none;border-radius:6px;display:inline-block">
              Open Employee Portal
            </a>
          </p>

          <p style="font-size:13px;color:#666">
            For security, set or reset your password through your authorized password setup process.
          </p>

          <p>Regards,<br/>GlobalScion Team</p>
        </div>
      </div>
    `,
  });

  return info;
};

module.exports = {
  transporter,
  sendEmployeeCredentials,
};