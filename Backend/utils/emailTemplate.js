const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });

const getEmailTemplate = ({
  title = "Welcome to GlobalScion Conferences",
  name = "Participant",
  message = "",
  buttonText = "",
  buttonUrl = "",
}) => {
  const safeTitle = escapeHtml(title);
  const safeName = escapeHtml(name);
  const safeMessage = message;
  const safeButtonText = escapeHtml(buttonText);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${safeTitle}</title>
</head>

<body style="margin:0;padding:0;background-color:#F3EEFF;font-family:Arial,Helvetica,sans-serif;color:#30234A;">

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"
    bgcolor="#F3EEFF" style="width:100%;background-color:#F3EEFF;padding:30px 10px;">
    <tr>
      <td align="center">

        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0"
          bgcolor="#FFFFFF"
          style="width:100%;max-width:600px;background-color:#FFFFFF;border:1px solid #E5D9FF;border-radius:12px;">

          <!-- Violet Header -->
          <tr>
            <td align="center" bgcolor="#6D28D9"
              style="background-color:#6D28D9;padding:32px 20px;border-radius:12px 12px 0 0;">
              <h1 style="margin:0;color:#FFFFFF;font-size:26px;line-height:1.4;font-weight:bold;">
                GlobalScion Conferences
              </h1>
              <p style="margin:8px 0 0;color:#F3E8FF;font-size:13px;line-height:1.6;">
                Connecting Knowledge. Inspiring Innovation.
              </p>
            </td>
          </tr>

          <!-- Email Content -->
          <tr>
            <td bgcolor="#FFFFFF"
              style="background-color:#FFFFFF;padding:32px 28px;">

              <h2 style="margin:0 0 20px;color:#6D28D9;font-size:22px;line-height:1.4;">
                ${safeTitle}
              </h2>

              <p style="margin:0 0 16px;color:#30234A;font-size:15px;line-height:1.8;">
                Dear ${safeName},
              </p>

              <div style="color:#514563;font-size:15px;line-height:1.9;">
                ${safeMessage}
              </div>

              ${
                buttonText && buttonUrl
                  ? `<table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin:25px 0;">
                      <tr>
                        <td align="center" bgcolor="#7C3AED" style="background-color:#7C3AED;border-radius:7px;">
                          <a href="${escapeHtml(buttonUrl)}"
                            style="display:inline-block;background-color:#7C3AED;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:bold;padding:14px 25px;border-radius:7px;">
                            ${safeButtonText}
                          </a>
                        </td>
                      </tr>
                    </table>`
                  : ""
              }

              <p style="margin:24px 0 0;color:#514563;font-size:14px;line-height:1.8;">
                Thank you for connecting with GlobalScion Conferences.
                We look forward to supporting your conference experience.
              </p>

              <p style="margin:22px 0 0;color:#514563;font-size:14px;line-height:1.8;">
                Best regards,<br>
                <strong style="color:#6D28D9;">GlobalScion Conferences Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#EDE5FF"
              style="background-color:#EDE5FF;padding:22px 20px;border-top:1px solid #DCCBFF;border-radius:0 0 12px 12px;">
              <p style="margin:0 0 8px;color:#5B21B6;font-size:13px;font-weight:bold;">
                GlobalScion Conferences
              </p>
              <p style="margin:0;color:#625775;font-size:11px;line-height:1.8;">
                This is an automated email. Please do not reply unless instructed.
              </p>
              <p style="margin:10px 0 0;color:#625775;font-size:11px;">
                &copy; ${new Date().getFullYear()} GlobalScion Conferences. All rights reserved.
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

module.exports = { getEmailTemplate };