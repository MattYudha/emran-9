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
    const { name, email, subject, message } = await req.json();

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
      .from("contacts")
      .insert([{ name, email, subject, message }]);

    if (insertError) {
      throw insertError;
    }

    // HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
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
            background-color: #16a34a;
            padding: 20px;
            text-align: center;
          }
          .header img {
            max-width: 150px;
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
          }
          .content p {
            font-size: 16px;
            line-height: 1.6;
            margin: 10px 0;
          }
          .content .field {
            margin-bottom: 15px;
          }
          .content .field strong {
            display: inline-block;
            width: 100px;
            color: #555555;
          }
          .content .message {
            background-color: #f9fafb;
            padding: 15px;
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
          }
          @media only screen and (max-width: 600px) {
            .container {
              margin: 10px;
            }
            .content {
              padding: 20px;
            }
            .header img {
              max-width: 120px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://via.placeholder.com/150x50?text=Company+Logo" alt="PT Company Emran Ghanim Asahi Logo">
          </div>
          <div class="content">
            <h2>New Contact Form Submission</h2>
            <div class="field">
              <strong>Name:</strong> ${name}
            </div>
            <div class="field">
              <strong>Email:</strong> ${email}
            </div>
            <div class="field">
              <strong>Subject:</strong> ${subject}
            </div>
            <div class="field">
              <strong>Message:</strong>
              <div class="message">${message}</div>
            </div>
          </div>
          <div class="footer">
            <p>PT Company Emran Ghanim Asahi</p>
            <p>123 Business Avenue, Tokyo, Japan | <a href="mailto:contact@company.com">contact@company.com</a></p>
            <p>&copy; ${new Date().getFullYear()} PT Company Emran Ghanim Asahi. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Kirim email notifikasi menggunakan Supabase SMTP config
    const { error: mailError } = await supabaseClient.functions.invoke(
      "send-email",
      {
        body: {
          to: "contact@company.com",
          subject: `New Contact Form Submission: ${subject}`,
          html: htmlContent,
        },
      }
    );

    if (mailError) {
      throw mailError;
    }

    return new Response(JSON.stringify({ message: "Pesan berhasil dikirim" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
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
