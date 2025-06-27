// src/utils/confirmationEmailTemplate.ts

/**
 * Mengembalikan string HTML untuk email konfirmasi pengiriman formulir.
 *
 * @param name Nama pengirim.
 * @param email Email pengirim.
 * @param subject Subjek pesan.
 * @param message Isi pesan.
 * @param currentYear Tahun saat ini untuk footer hak cipta.
 * @returns String HTML lengkap untuk email konfirmasi.
 */
export const generateConfirmationEmailHtml = (
  name: string,
  email: string,
  subject: string,
  message: string,
  currentYear: number
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation Email - PT Company Emran Ghanim Asahi</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #16a34a 0%, #a3e4b9 100%);
          padding: 15px;
          text-align: center;
          position: relative;
        }
        .header img {
          max-width: 100px;
          height: auto;
        }
        .content {
          padding: 30px;
          color: #333333;
        }
        .content h2 {
          color: #16a34a;
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          margin: 10px 0;
        }
        .content .field {
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f9fafb;
          border-radius: 6px;
        }
        .content .field strong {
          display: inline-block;
          width: 120px;
          color: #555555;
          font-weight: 600;
        }
        .content .message-body {
          background-color: #f0f9f0;
          padding: 15px;
          border-left: 4px solid #16a34a;
          border-radius: 6px;
          font-size: 16px;
          line-height: 1.6;
        }
        .footer {
          background-color: #f4f4f4;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666666;
        }
        .footer a {
          color: #16a34a;
          text-decoration: none;
          font-weight: 600;
        }
        .footer a:hover {
          text-decoration: underline;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #16a34a;
          color: #ffffff;
          text-align: center;
          text-decoration: none;
          border-radius: 6px;
          font-size: 16px;
          margin-top: 20px;
          min-width: 200px;
        }
        .button:hover {
          background-color: #13863b;
        }

        /* Enhanced Mobile Responsiveness */
        @media only screen and (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 0;
          }
          .header {
            padding: 10px;
          }
          .header img {
            max-width: 80px;
          }
          .content {
            padding: 15px;
          }
          .content h2 {
            font-size: 20px;
          }
          .content p {
            font-size: 14px;
          }
          .content .field {
            padding: 8px;
          }
          .content .field strong {
            width: 100%;
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .content .message-body {
            padding: 10px;
            font-size: 14px;
          }
          .button {
            display: block;
            width: 100%;
            box-sizing: border-box;
            text-align: center;
            padding: 12px;
            font-size: 16px;
          }
          .footer {
            padding: 15px;
            font-size: 12px;
          }
          .footer p {
            margin: 5px 0;
          }
        }
        /* Extra small devices (e.g., very small phones) */
        @media only screen and (max-width: 400px) {
          .content h2 {
            font-size: 18px;
          }
          .content p {
            font-size: 13px;
          }
          .content .field strong {
            font-size: 13px;
          }
          .content .message-body {
            font-size: 13px;
          }
          .button {
            font-size: 14px;
            padding: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://emranghanisahi.netlify.app/assets/logo.png" alt="PT Company Emran Ghanim Asahi Logo">
        </div>
        <div class="content">
          <h2>Terima Kasih atas Pesan Anda</h2>
          <p>Yth. ${name},</p>
          <p>Kami telah menerima pesan Anda dan akan segera menanggapi dalam waktu dekat. Berikut adalah ringkasan dari pengiriman Anda:</p>
          <div class="field">
            <strong>Nama:</strong> ${name}
          </div>
          <div class="field">
            <strong>Email:</strong> ${email}
          </div>
          <div class="field">
            <strong>Subjek:</strong> ${subject}
          </div>
          <div class="field">
            <strong>Pesan:</strong>
            <div class="message-body">${message}</div>
          </div>
          <p>Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami melalui tombol di bawah ini.</p>
          <a href="mailto:contact@company.com" class="button">Hubungi Kami</a>
        </div>
        <div class="footer">
          <p><strong>PT Company Emran Ghanim Asahi</strong></p>
          <p>123 Business Avenue, Tokyo, Japan | <a href="mailto:contact@company.com">contact@company.com</a></p>
          <p>© ${currentYear} PT Company Emran Ghanim Asahi. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
