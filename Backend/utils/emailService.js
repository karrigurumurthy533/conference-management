const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,

  secure: Number(process.env.SMTP_PORT) === 465,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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

  await transporter.sendMail({
    from: `"GlobalScion" <${process.env.SMTP_USER}>`,

    to: email,

    subject: "Your GlobalScion Employee Account",

    html: `
      <!DOCTYPE html>

      <html>
        <head>
          <meta charset="UTF-8" />

          <title>
            GlobalScion Employee Account
          </title>
        </head>

        <body
          style="
            margin: 0;
            padding: 30px 15px;
            background: #f5f5f5;
            font-family: Arial, Helvetica, sans-serif;
          "
        >

          <div
            style="
              max-width: 650px;
              margin: 0 auto;
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              overflow: hidden;
            "
          >

            <!-- HEADER -->

            <div
              style="
                background: #7c3aed;
                padding: 28px;
                color: #ffffff;
              "
            >

              <h2
                style="
                  margin: 0 0 8px;
                  font-size: 22px;
                "
              >
                Welcome to GlobalScion
              </h2>

              <p
                style="
                  margin: 0;
                  font-size: 14px;
                  opacity: 0.9;
                "
              >
                Your employee account has been created
              </p>

            </div>


            <!-- CONTENT -->

            <div
              style="
                padding: 30px;
              "
            >

              <p
                style="
                  margin: 0 0 15px;
                  font-size: 15px;
                  color: #374151;
                "
              >
                Hello
                <strong>${name}</strong>,
              </p>

              <p
                style="
                  color: #4b5563;
                  line-height: 1.6;
                  font-size: 14px;
                "
              >
                Your GlobalScion employee account has
                been successfully created.
                You can use the following credentials
                to access your employee dashboard.
              </p>


              <!-- ACCOUNT DETAILS -->

              <div
                style="
                  margin-top: 25px;
                  padding: 20px;
                  background: #f5f3ff;
                  border: 1px solid #ddd6fe;
                  border-radius: 10px;
                "
              >

                <p
                  style="
                    margin: 0 0 12px;
                    color: #374151;
                    font-size: 14px;
                  "
                >
                  <strong>Email:</strong>
                  ${email}
                </p>

                <p
                  style="
                    margin: 0 0 12px;
                    color: #374151;
                    font-size: 14px;
                  "
                >
                  <strong>Employee Type:</strong>
                  ${employeeType}
                </p>

                <p
                  style="
                    margin: 0;
                    color: #374151;
                    font-size: 14px;
                  "
                >
                  <strong>Password:</strong>
                  ${password}
                </p>

              </div>


              <!-- LOGIN BUTTON -->

              <div
                style="
                  margin-top: 28px;
                  text-align: center;
                "
              >

                <a
                  href="${loginUrl}"
                  style="
                    display: inline-block;
                    background: #7c3aed;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: bold;
                  "
                >
                  Login to Employee Dashboard
                </a>

              </div>


              <!-- SECURITY MESSAGE -->

              <div
                style="
                  margin-top: 25px;
                  padding: 15px;
                  background: #fff7ed;
                  border-left: 4px solid #f97316;
                  border-radius: 4px;
                "
              >

                <p
                  style="
                    margin: 0;
                    color: #9a3412;
                    font-size: 12px;
                    line-height: 1.6;
                  "
                >
                  For security, please change your password
                  after your first login.
                </p>

              </div>

            </div>


            <!-- FOOTER -->

            <div
              style="
                padding: 16px 25px;
                background: #f9fafb;
                border-top: 1px solid #e5e7eb;
                text-align: center;
              "
            >

              <p
                style="
                  margin: 0;
                  color: #9ca3af;
                  font-size: 12px;
                "
              >
                GlobalScion
              </p>

            </div>

          </div>

        </body>
      </html>
    `,
  });
};


module.exports = {
  transporter,
  sendEmployeeCredentials,
};