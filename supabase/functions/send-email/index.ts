import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts"; // Pastikan file ini ada di lokasi yang benar!

// Inisialisasi Supabase client
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "", // SUPABASE_URL otomatis disediakan oleh Supabase
  Deno.env.get("MY_SUPABASE_SERVICE_ROLE_KEY") ?? "" // <--- SUDAH DIGANTI KE NAMA SECRET YANG BARU
);

serve(async (req) => {
  // Tambahkan header CORS untuk permintaan preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Pastikan permintaan adalah JSON dan parse body-nya
    const { name, email, subject, message } = await req.json();

    // Validasi field yang diperlukan
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400, // Bad Request
        }
      );
    }

    // Simpan data formulir ke database Supabase di tabel 'contacts_submissions'
    const { error: insertError } = await supabaseClient
      .from("contact_submissions") // <--- Pastikan nama tabel ini benar 'contact_submissions'
      .insert([{ name, email, subject, message }]);

    // Tangani error jika penyisipan data gagal
    if (insertError) {
      throw insertError; // Lemparkan error agar ditangkap di blok catch di bawah
    }

    // --- BAGIAN DI BAWAH INI TELAH DIHAPUS/DIKOMENTARI ---
    // Kode HTML email template dan pemanggilan fungsi rekursif
    // telah dihapus karena pengiriman email ditangani di frontend (dengan EmailJS)
    // dan pemanggilan rekursif menyebabkan loop tak terbatas/Error 500.
    /*
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>...</style>
      </head>
      <body>...</body>
      </html>
    `;

    const { error: mailError } = await supabaseClient.functions.invoke(
      "send-email", // Ini menyebabkan loop tak terbatas
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
    */
    // --- AKHIR BAGIAN YANG DIHAPUS/DIKOMENTARI ---

    // Jika semua proses berhasil, kirim respons sukses
    return new Response(JSON.stringify({ message: "Pesan berhasil dikirim" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // OK
    });
  } catch (error) {
    // Tangani error yang terjadi selama eksekusi fungsi
    // Cetak pesan error yang lebih detail ke log Supabase
    console.error("Function error:", error.message, error.stack);
    // Atau bisa juga: console.error("Function error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));

    // Kirim respons error ke frontend
    return new Response(
      JSON.stringify({ error: error.message || "Terjadi kesalahan" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500, // Internal Server Error
      }
    );
  }
});
