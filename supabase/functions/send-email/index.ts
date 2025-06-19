import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// Inisialisasi Supabase client
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  // Tambahkan header CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, lang } = await req.json(); // Ambil 'lang' juga

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Simpan ke database
    const { error: insertError } = await supabaseClient
      .from("contact_submissions") // Ubah dari 'contacts' ke 'contact_submissions'
      .insert([{ name, email, subject, message, lang, user_agent: req.headers.get('User-Agent'), source_ip: req.headers.get('X-Forwarded-For') || req.url.split('/')[2] }]); // Tambahkan lang, user_agent, source_ip

    if (insertError) {
      throw insertError;
    }

    // Tentukan teks berdasarkan bahasa
    const isIndonesian = lang === 'id';
    const thankYouTitle = isIndonesian ? "Terima Kasih atas Pesan Anda" : "Thank You for Your Message";
    const greetingText = isIndonesian ? `Yth. ${name},<br><br>Kami telah menerima pesan Anda dan akan segera menanggapi dalam waktu dekat. Berikut adalah ringkasan dari pengiriman Anda:` : `Dear ${name},<br><br>We have received your message and will get back to you shortly. Here is a summary of your submission:`;
    const contactInfoText = isIndonesian ? "Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami melalui tombol di bawah ini." : "If you have any further questions, please do not hesitate to contact us via the button below.";
    const contactButtonText = isIndonesian ? "Hubungi Kami" : "Contact Us";
    const allRightsReservedText = isIndonesian ? "Hak Cipta Dilindungi" : "All rights reserved.";

    // HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${thankYouTitle} - PT Emran Ghanim Asahi</title>
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
          .content .message {
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
          @media only screen and (max-width: 600px) {
            .container { margin: 10px; border-radius: 0; }
            .header { padding: 10px; }
            .header img { max-width: 80px; }
            .content { padding: 15px; }
            .content h2 { font-size: 20px; }
            .content p { font-size: 14px; }
            .content .field { padding: 8px; }
            .content .field strong { width: 100%; display: block; margin-bottom: 5px; font-size: 14px; }
            .content .message { padding: 10px; font-size: 14px; }
            .button { display: block; width: 100%; box-sizing: border-box; text-align: center; padding: 12px; font-size: 16px; }
            .footer { padding: 15px; font-size: 12px; }
            .footer p { margin: 5px 0; }
          }
          @media only screen and (max-width: 400px) {
            .content h2 { font-size: 18px; }
            .content p { font-size: 13px; }
            .content .field strong { font-size: 13px; }
            .content .message { font-size: 13px; }
            .button { font-size: 14px; padding: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://emranghanisahi.netlify.app/assets/logo.png" alt="PT Company Emran Ghanim Asahi Logo">
          </div>
          <div class="content">
            <h2>${thankYouTitle}</h2>
            <p>${greetingText}</p>
            <div class="field">
              <strong>${isIndonesian ? "Nama:" : "Name:"}</strong> ${name}
            </div>
            <div class="field">
              <strong>${isIndonesian ? "Email:" : "Email:"}</strong> ${email}
            </div>
            <div class="field">
              <strong>${isIndonesian ? "Subjek:" : "Subject:"}</strong> ${subject}
            </div>
            <div class="field">
              <strong>${isIndonesian ? "Pesan:" : "Message:"}</strong>
              <div class="message">${message}</div>
            </div>
            <p>${contactInfoText}</p>
            <a href="mailto:contact@company.com" class="button">${contactButtonText}</a>
          </div>
          <div class="footer">
            <p><strong>PT Emran Ghanim Asahi</strong></p>
            <p>The Avenue Blok Z.6, Jl. Citra Raya Boulevard No.36, Kec. Cikupa, Kabupaten Tangerang, Banten 15710 | <a href="mailto:emranghanimasahi@gmail.com">emranghanimasahi@gmail.com</a></p>
            <p>&copy; ${new Date().getFullYear()} PT Emran Ghanim Asahi. ${allRightsReservedText}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Kirim email notifikasi ke perusahaan
    // Note: Anda perlu mengkonfigurasi email provider di Supabase untuk ini.
    // Kode ini akan mencoba mengirim email melalui fungsi Supabase 'send-email'.
    // Pastikan fungsi 'send-email' di Supabase Functions Anda dapat di-invoke
    // dan memiliki konfigurasi SMTP yang benar.
    const { error: companyMailError } = await supabaseClient.functions.invoke(
      "send-email",
      {
        body: {
          to: Deno.env.get("COMPANY_EMAIL_RECEIVER") ?? "emranghanimasahi@gmail.com", // Gunakan env var atau default
          subject: `New Contact Form Submission: ${subject}`,
          html: htmlContent,
        },
      }
    );

    if (companyMailError) {
      console.error("Error sending email to company:", companyMailError);
      // Jangan throw error di sini agar form submission tetap berhasil
    }

    return new Response(JSON.stringify({ message: "Pesan berhasil dikirim" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Terjadi kesalahan" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});