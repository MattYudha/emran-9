/*
  # RFQ Automation and CMS Tables

  1. New Tables
    - `rfq_submissions` - Store RFQ data from chatbot
    - `chatbot_responses` - CMS-driven chatbot responses
    - `ai_config` - Configurable AI parameters
    - `ai_feedback_queue` - Human-in-the-loop feedback system

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- RFQ Submissions Table
CREATE TABLE IF NOT EXISTS rfq_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  user_email text NOT NULL CHECK (user_email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  project_name text NOT NULL,
  product_category text,
  size_specifications text,
  quantity integer NOT NULL CHECK (quantity > 0),
  deadline date,
  design_file_urls text[] DEFAULT '{}',
  additional_notes text,
  estimated_cost_min numeric,
  estimated_cost_max numeric,
  currency text DEFAULT 'IDR',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'quoted', 'completed', 'cancelled')),
  source_ip text,
  user_agent text,
  language text DEFAULT 'id',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chatbot Responses CMS Table
CREATE TABLE IF NOT EXISTS chatbot_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_triggers text[] NOT NULL,
  response_text_en text NOT NULL,
  response_text_id text NOT NULL,
  response_text_ja text,
  response_text_zh text,
  response_text_ar text,
  response_type text DEFAULT 'static' CHECK (response_type IN ('static', 'dynamic_prompt', 'faq', 'rfq_trigger')),
  priority integer DEFAULT 0,
  is_active boolean DEFAULT true,
  category text,
  last_updated_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI Configuration Table
CREATE TABLE IF NOT EXISTS ai_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parameter_name text UNIQUE NOT NULL,
  parameter_value numeric NOT NULL,
  parameter_type text DEFAULT 'number' CHECK (parameter_type IN ('number', 'string', 'boolean')),
  description text,
  min_value numeric,
  max_value numeric,
  is_active boolean DEFAULT true,
  last_updated_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI Feedback Queue Table
CREATE TABLE IF NOT EXISTS ai_feedback_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text,
  user_query text NOT NULL,
  ai_response text NOT NULL,
  user_feedback text CHECK (user_feedback IN ('positive', 'negative', 'neutral')),
  correct_response text,
  feedback_notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  reviewer_id text,
  session_id text,
  language text DEFAULT 'id',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_rfq_submissions_email ON rfq_submissions (user_email);
CREATE INDEX idx_rfq_submissions_status ON rfq_submissions (status);
CREATE INDEX idx_rfq_submissions_created_at ON rfq_submissions (created_at);

CREATE INDEX idx_chatbot_responses_active ON chatbot_responses (is_active);
CREATE INDEX idx_chatbot_responses_category ON chatbot_responses (category);
CREATE INDEX idx_chatbot_responses_priority ON chatbot_responses (priority DESC);

CREATE INDEX idx_ai_config_active ON ai_config (is_active);
CREATE INDEX idx_ai_config_parameter_name ON ai_config (parameter_name);

CREATE INDEX idx_ai_feedback_status ON ai_feedback_queue (status);
CREATE INDEX idx_ai_feedback_created_at ON ai_feedback_queue (created_at);

-- Enable RLS on all tables
ALTER TABLE rfq_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feedback_queue ENABLE ROW LEVEL SECURITY;

-- RFQ Submissions Policies
CREATE POLICY "Allow anonymous RFQ submissions" ON rfq_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow admin to read RFQ submissions" ON rfq_submissions
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'admin');

CREATE POLICY "Allow admin to update RFQ submissions" ON rfq_submissions
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'admin');

-- Chatbot Responses Policies
CREATE POLICY "Allow public read of active chatbot responses" ON chatbot_responses
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Allow admin to manage chatbot responses" ON chatbot_responses
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin');

-- AI Config Policies
CREATE POLICY "Allow public read of active AI config" ON ai_config
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Allow admin to manage AI config" ON ai_config
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin');

-- AI Feedback Queue Policies
CREATE POLICY "Allow anonymous feedback submission" ON ai_feedback_queue
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow admin to manage feedback queue" ON ai_feedback_queue
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin');

-- Insert default AI configuration
INSERT INTO ai_config (parameter_name, parameter_value, description, min_value, max_value) VALUES
  ('temperature', 0.4, 'Controls randomness in AI responses', 0.0, 1.0),
  ('topP', 0.8, 'Controls diversity of AI responses', 0.0, 1.0),
  ('topK', 40, 'Controls vocabulary size for AI responses', 1, 100),
  ('maxOutputTokens', 200, 'Maximum length of AI responses', 50, 500);

-- Insert default chatbot responses
INSERT INTO chatbot_responses (keyword_triggers, response_text_en, response_text_id, response_type, category, priority) VALUES
  (ARRAY['hello', 'hi', 'halo', 'hai'], 'Hello! I''m Emran Chatbot, your virtual assistant for PT. EMRAN GHANIM ASAHI. How can I help you today?', 'Halo! Saya Emran Chatbot, asisten virtual PT. EMRAN GHANIM ASAHI. Ada yang bisa saya bantu hari ini?', 'static', 'greeting', 10),
  (ARRAY['quote', 'price', 'cost', 'harga', 'penawaran'], 'I can help you get a detailed quote! Would you like me to guide you through our RFQ process?', 'Saya bisa membantu Anda mendapatkan penawaran detail! Apakah Anda ingin saya memandu proses RFQ kami?', 'rfq_trigger', 'pricing', 9),
  (ARRAY['services', 'layanan', 'what do you offer'], 'We offer comprehensive printing and labeling solutions including UPC labels, stickers, books, calendars, brochures, and more. What specific service interests you?', 'Kami menawarkan solusi cetak dan labeling komprehensif termasuk label UPC, stiker, buku, kalender, brosur, dan lainnya. Layanan apa yang Anda minati?', 'static', 'services', 8);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_rfq_submissions_updated_at BEFORE UPDATE ON rfq_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chatbot_responses_updated_at BEFORE UPDATE ON chatbot_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_config_updated_at BEFORE UPDATE ON ai_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_feedback_queue_updated_at BEFORE UPDATE ON ai_feedback_queue FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
