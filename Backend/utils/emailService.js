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

  const employeeFreshLoginUrl = (() => {
    try {
      const url = new URL(employeeLoginUrl);
      url.searchParams.set("freshLogin", "1");
      return url.toString();
    } catch {
      const [path, hash = ""] = employeeLoginUrl.split("#", 2);
      const separator = path.includes("?") ? "&" : "?";
      return `${path}${separator}freshLogin=1${hash ? `#${hash}` : ""}`;
    }
  })();

  const info = await transporter.sendMail({
    from: `"GlobalScion" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your GlobalScion Employee Account",

    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#333">
        <div style="background:#7c3aed;padding:28px 24px;border-radius:12px 12px 0 0">
          <h1 style="color:#ffffff;margin:0;font-size:28px">Welcome to GlobalScion</h1>
          <p style="color:#ffffff;margin:8px 0 0;font-size:16px">Your employee account has been created</p>
        </div>

        <div style="padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px">
          <p style="font-size:16px">Hello <strong>${escapeHtml(name || "Employee")}</strong>,</p>

          <p style="font-size:15px;line-height:1.7;color:#555">
            Your GlobalScion employee account has been successfully created.
            You can use the following credentials to access your employee dashboard.
          </p>

          <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:10px;padding:18px 20px;margin:24px 0">
            <p style="margin:0 0 10px"><strong>Email:</strong><br/>${escapeHtml(email)}</p>
            <p style="margin:0 0 10px"><strong>Employee Type:</strong> ${escapeHtml(employeeType || "Employee")}</p>
            <p style="margin:0"><strong>Password:</strong> ${escapeHtml(password || "")}</p>
          </div>

          <p style="text-align:center;margin:28px 0">
            <a href="${escapeHtml(employeeFreshLoginUrl)}"
              style="background:#7c3aed;color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;font-size:16px">
              Login to Employee Dashboard
            </a>
          </p>

          <div style="background:#fff7ed;border-left:4px solid #ea580c;padding:14px 16px;border-radius:4px;margin:24px 0">
            <p style="margin:0;font-size:14px;line-height:1.6;color:#c2410c">
              For security, please change your password after your first login.
            </p>
          </div>

          <p style="margin-top:28px">Regards,<br/>GlobalScion Team</p>
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