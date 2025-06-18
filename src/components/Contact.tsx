import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext.tsx";
import { translations } from "../utils/translations.ts";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactFormSchema,
  type ContactFormData,
} from "../utils/validation.ts";
import emailjs from "@emailjs/browser";

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      const emailjsToEmail = import.meta.env.VITE_EMAILJS_TO_EMAIL;

      // Validate environment variables (line 55)
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase configuration");
      }

      if (
        !emailjsServiceId ||
        !emailjsTemplateId ||
        !emailjsPublicKey ||
        !emailjsToEmail
      ) {
        throw new Error("Missing EmailJS configuration");
      }

      // Send data to Supabase Edge Function
      const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ ...data, lang: language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save message");
      }

      // Send email to company via EmailJS
      await emailjs.send(
        emailjsServiceId,
        emailjsTemplateId,
        {
          from_name: data.name,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
          to_email: emailjsToEmail,
        },
        emailjsPublicKey
      );

      // Send confirmation email to user via EmailJS
      const confirmationHtml = `
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
              <img src="assets/logo.png" alt="PT Company Emran Ghanim Asahi Logo">
            </div>
            <div class="content">
              <h2>Terima Kasih atas Pesan Anda</h2>
              <p>Yth. ${data.name},</p>
              <p>Kami telah menerima pesan Anda dan akan segera menanggapi dalam waktu dekat. Berikut adalah ringkasan dari pengiriman Anda:</p>
              <div class="field">
                <strong>Nama:</strong> ${data.name}
              </div>
              <div class="field">
                <strong>Email:</strong> ${data.email}
              </div>
              <div class="field">
                <strong>Subjek:</strong> ${data.subject}
              </div>
              <div class="field">
                <strong>Pesan:</strong>
                <div class="message">${data.message}</div>
              </div>
              <p>Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami melalui tombol di bawah ini.</p>
              <a href="mailto:contact@company.com" class="button">Hubungi Kami</a>
            </div>
            <div class="footer">
              <p><strong>PT Company Emran Ghanim Asahi</strong></p>
              <p>123 Business Avenue, Tokyo, Japan | <a href="mailto:contact@company.com">contact@company.com</a></p>
              <p>© ${new Date().getFullYear()} PT Company Emran Ghanim Asahi. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await emailjs.send(
        emailjsServiceId,
        emailjsTemplateId, // Use the same template for both emails for simplicity
        {
          from_name: "PT Company Emran Ghanim Asahi",
          from_email: "no-reply@company.com",
          subject: "Thank You for Contacting PT Company Emran Ghanim Asahi",
          message_html: confirmationHtml, // Send as HTML
          to_email: data.email, // Send to the user's email
        },
        emailjsPublicKey
      );

      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(
        err.message ||
          t.errorSending ||
          "Error sending message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5" />,
      title: t.address,
      details:
        "The Avenue Blok Z.6, Jl. Citra Raya Boulevard No.36, Kec. Cikupa, Kabupaten Tangerang, Banten 15710",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: t.phone,
      details: "0813-9831-8839",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: t.email,
      details: "emranghanimasahi@gmail.com",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: t.hours,
      details: t.businessHours,
    },
  ];

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.getInTouch}
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
            {t.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="flex items-start bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-transform hover:shadow-lg"
              >
                <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-full mr-4">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md">
            {submitted && (
              <div className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 mb-6 rounded">
                <p className="font-semibold">{t.messageSent}</p>
                <p>{t.messageConfirmation}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6 rounded">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {t.yourName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${
                      errors.name
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder={t.namePlaceholder}
                  />
                  {errors.name && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {t.yourEmail} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder={t.emailPlaceholder}
                  />
                  {errors.email && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t.subject} <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  {...register("subject")}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white ${
                    errors.subject
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <option value="">{t.selectSubject}</option>
                  <option value="quote">{t.requestQuote}</option>
                  <option value="info">{t.generalInquiry}</option>
                  <option value="support">{t.supportRequest}</option>
                  <option value="partnership">{t.partnership}</option>
                </select>
                {errors.subject && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t.message} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  {...register("message")}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white resize-none ${
                    errors.message
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder={t.messagePlaceholder}
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center w-full md:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300 ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t.sending}
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    {t.sendMessage}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
