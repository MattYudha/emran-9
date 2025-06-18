import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Initialize Supabase client
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { rfqId, rfqData } = await req.json();

    if (!rfqId || !rfqData) {
      return new Response(
        JSON.stringify({ error: "Missing RFQ ID or data" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Generate comprehensive RFQ notification email
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New RFQ Submission - PT Emran Ghanim Asahi</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          .container {
            max-width: 700px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
            padding: 30px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 40px;
            color: #333333;
          }
          .rfq-id {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-left: 4px solid #0ea5e9;
            padding: 20px;
            margin-bottom: 30px;
            border-radius: 8px;
          }
          .rfq-id h2 {
            margin: 0 0 10px 0;
            color: #0369a1;
            font-size: 20px;
          }
          .rfq-id p {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #0c4a6e;
          }
          .section {
            margin-bottom: 30px;
            padding: 25px;
            background-color: #f8fafc;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
          }
          .section h3 {
            color: #16a34a;
            font-size: 18px;
            margin: 0 0 15px 0;
            font-weight: 600;
            display: flex;
            align-items: center;
          }
          .section h3::before {
            content: "●";
            color: #16a34a;
            margin-right: 10px;
            font-size: 12px;
          }
          .field-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          .field {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .field-label {
            font-weight: 600;
            color: #374151;
            font-size: 14px;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .field-value {
            color: #111827;
            font-size: 16px;
            font-weight: 500;
          }
          .full-width {
            grid-column: 1 / -1;
          }
          .message-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            font-style: italic;
            line-height: 1.7;
          }
          .priority-notice {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
          }
          .priority-notice h3 {
            color: #92400e;
            margin: 0 0 10px 0;
            font-size: 18px;
          }
          .priority-notice p {
            color: #78350f;
            margin: 0;
            font-weight: 500;
          }
          .footer {
            background-color: #f1f5f9;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer h3 {
            color: #16a34a;
            margin: 0 0 15px 0;
            font-size: 20px;
          }
          .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
          }
          .contact-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .contact-item strong {
            color: #16a34a;
            display: block;
            margin-bottom: 5px;
          }
          @media only screen and (max-width: 600px) {
            .container { margin: 10px; border-radius: 8px; }
            .content { padding: 20px; }
            .field-grid { grid-template-columns: 1fr; gap: 15px; }
            .header { padding: 20px; }
            .header h1 { font-size: 24px; }
            .section { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 New RFQ Submission</h1>
            <p>PT Emran Ghanim Asahi - Sales Notification</p>
          </div>
          
          <div class="content">
            <div class="rfq-id">
              <h2>RFQ Reference</h2>
              <p>#${rfqId}</p>
            </div>

            <div class="priority-notice">
              <h3>⚡ Action Required</h3>
              <p>A new Request for Quote has been submitted. Please review and respond within 24 hours to maintain our service excellence.</p>
            </div>

            <div class="section">
              <h3>Customer Information</h3>
              <div class="field-grid">
                <div class="field">
                  <div class="field-label">Customer Name</div>
                  <div class="field-value">${rfqData.userName}</div>
                </div>
                <div class="field">
                  <div class="field-label">Email Address</div>
                  <div class="field-value">${rfqData.userEmail}</div>
                </div>
                <div class="field full-width">
                  <div class="field-label">Project Name</div>
                  <div class="field-value">${rfqData.projectName}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h3>Project Specifications</h3>
              <div class="field-grid">
                <div class="field">
                  <div class="field-label">Product Category</div>
                  <div class="field-value">${rfqData.productCategory || 'Not specified'}</div>
                </div>
                <div class="field">
                  <div class="field-label">Quantity</div>
                  <div class="field-value">${rfqData.quantity.toLocaleString()} units</div>
                </div>
                <div class="field">
                  <div class="field-label">Size Specifications</div>
                  <div class="field-value">${rfqData.sizeSpecifications}</div>
                </div>
                <div class="field">
                  <div class="field-label">Deadline</div>
                  <div class="field-value">${rfqData.deadline || 'Flexible'}</div>
                </div>
                ${rfqData.estimatedCostMin && rfqData.estimatedCostMax ? `
                <div class="field full-width">
                  <div class="field-label">Estimated Budget Range</div>
                  <div class="field-value">${rfqData.currency} ${rfqData.estimatedCostMin.toLocaleString()} - ${rfqData.estimatedCostMax.toLocaleString()}</div>
                </div>
                ` : ''}
              </div>
            </div>

            ${rfqData.designFileUrls && rfqData.designFileUrls.length > 0 ? `
            <div class="section">
              <h3>Design Files</h3>
              <div class="field">
                <div class="field-label">Uploaded Files (${rfqData.designFileUrls.length})</div>
                <div class="field-value">
                  ${rfqData.designFileUrls.map((url, index) => 
                    `<a href="${url}" target="_blank" style="color: #16a34a; text-decoration: none; display: block; margin: 5px 0;">📎 Design File ${index + 1}</a>`
                  ).join('')}
                </div>
              </div>
            </div>
            ` : ''}

            ${rfqData.additionalNotes ? `
            <div class="section">
              <h3>Additional Notes</h3>
              <div class="message-box">
                "${rfqData.additionalNotes}"
              </div>
            </div>
            ` : ''}

            <div class="section">
              <h3>Submission Details</h3>
              <div class="field-grid">
                <div class="field">
                  <div class="field-label">Submission Date</div>
                  <div class="field-value">${new Date().toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</div>
                </div>
                <div class="field">
                  <div class="field-label">Language</div>
                  <div class="field-value">${rfqData.language === 'id' ? 'Indonesian' : 'English'}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="footer">
            <h3>Next Steps</h3>
            <p style="color: #64748b; margin-bottom: 20px;">
              Please review this RFQ and prepare a detailed quote. Contact the customer within 24 hours to maintain our service standards.
            </p>
            
            <div class="contact-info">
              <div class="contact-item">
                <strong>Sales Team</strong>
                sales@emranghanimasahi.net
              </div>
              <div class="contact-item">
                <strong>Direct Contact</strong>
                Mr. Darmawan: 0813-9831-8839
              </div>
              <div class="contact-item">
                <strong>Office</strong>
                (021) 89088260
              </div>
            </div>
            
            <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
              © ${new Date().getFullYear()} PT Emran Ghanim Asahi. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Here you would integrate with your email service
    // For now, we'll just log the email content and return success
    console.log('RFQ Notification Email Generated:', {
      rfqId,
      customerEmail: rfqData.userEmail,
      projectName: rfqData.projectName
    });

    return new Response(
      JSON.stringify({ 
        message: "RFQ notification processed successfully",
        rfqId: rfqId
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("RFQ notification error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process RFQ notification" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
