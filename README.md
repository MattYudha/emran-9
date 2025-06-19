# Emran Ghani Asahi - Premium Printing & Design Solutions

![Emran Ghani Asahi Logo](public/assets/logo.png)

## Overview

Welcome to **Emran Ghani Asahi**, a leading provider of premium printing and innovative design solutions. This repository hosts the source code for our comprehensive web application, built with cutting-edge technologies to deliver exceptional customer experiences and streamline our internal operations.

Our platform serves as a digital hub for clients to explore our services, request quotes, engage with an AI-powered chatbot for instant assistance, and manage their personal activity dashboards. For our team, it provides robust administrative tools to manage client inquiries, RFQs, user data, and AI configurations, ensuring efficiency and data-driven decision-making.

## Features

### Public Website
-   **Modern & Responsive UI:** Built with React, TypeScript, and Tailwind CSS for a seamless experience across all devices.
-   **Multi-Language Support:** Available in Indonesian, English, Japanese, Chinese, and Arabic for a global audience.
-   **Dynamic Content Sections:** Explore our services, company overview, expert team, diverse portfolio, and contact information.
-   **Interactive Contact Form:** Securely submit inquiries via our integrated contact form, powered by Supabase Edge Functions and EmailJS.
-   **Progressive Web App (PWA):** Offers an app-like experience with offline capabilities and installability.

### AI-Powered Chatbot
-   **Intelligent Assistant:** Provides instant answers to common questions about our services, pricing, and company details.
-   **Image Analysis:** Users can upload images for AI-driven analysis and personalized printing recommendations (powered by Google Gemini API).
-   **Dynamic Suggestions:** Offers context-aware response suggestions to guide user conversations.
-   **RFQ Triggering:** Seamlessly guides users to our detailed Request for Quote (RFQ) form.
-   **Feedback Mechanism:** Collects user feedback on AI responses to continuously improve accuracy and helpfulness.

### User Dashboard (Authenticated Users)
-   **Personalized Profile:** Users can manage their profile details, including avatar uploads, and view personal metrics.
-   **Activity Logger:** Track daily activities and mood scores, fostering a productive routine.
-   **Progress Tracking:** Visualize personal progress with charts showing activity trends and goal completion rates.
-   **Goal Management:** Set, track, and manage personal printing-related or productivity goals.
-   **Notification Center:** Receive important updates and alerts directly within the application.

### Request for Quote (RFQ) System
-   **Multi-Step Form:** A user-friendly, guided process for submitting detailed printing and design requests.
-   **File Uploads:** Securely upload design files to Supabase Storage.
-   **Automated Notifications:** Triggers email notifications to our sales team upon submission.

### Admin Dashboard
-   **Comprehensive Oversight:** Accessible only to authorized administrators for a holistic view of operations.
-   **Data Management:** Manage contact submissions, RFQ requests (with status updates), user profiles, user goals, and activities.
-   **AI Configuration:** Dynamically adjust AI parameters (e.g., temperature, topP, topK) for the chatbot via a dedicated interface.
-   **AI Feedback Review:** Monitor and review user feedback on AI responses, providing insights for AI model improvement.
-   **Analytics & Reporting:** Access detailed analytics events to understand user behavior and platform engagement.
-   **CSV Export:** Export critical data for further analysis or record-keeping.

## Technologies Used

-   **Frontend:** `React.js`, `TypeScript`, `Vite`, `Tailwind CSS`, `Framer Motion`, `React Router DOM`, `Zod`, `React Hook Form`
-   **Backend:** `Supabase` (PostgreSQL Database, Authentication, Storage, Edge Functions)
-   **AI Model:** `Google Gemini API` (via custom service layer)
-   **Email Service:** `EmailJS` (for direct email sending from client-side)
-   **PWA:** `vite-plugin-pwa` (Workbox for service worker management)
-   **Linting:** `ESLint`, `TypeScript-ESLint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
-   **HTTP Client:** `Axios`
-   **UUID Generation:** `uuid`

## 📁 Project Structure

```text
├── public/                       # Static assets (images, manifest.json, robots.txt)
├── src/
│   ├── api/                      # Supabase client initialization
│   ├── components/               # Reusable UI components
│   │   └── ui/                   # Generic UI components (e.g., Toast, Spinner)
│   ├── contexts/                 # React Contexts (Language, Theme)
│   ├── data/                     # Static data (e.g., printing specifications)
│   ├── hooks/                    # Custom React hooks (e.g., useChatbotLogic, useAnalytics)
│   ├── pages/                    # Main application pages (Home, Dashboard, Service pages, Admin)
│   ├── reducers/                 # Reducers for useReducer (e.g., chatbotReducer)
│   ├── services/                 # Business logic, API calls, and external service integrations
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Utility functions, constants, and translations
├── supabase/                     # Supabase project configuration, migrations, and Edge Functions
├── .env.example                  # Environment variables template
├── package.json                  # Project dependencies and scripts
├── package-lock.json             # Locked dependencies
├── vite.config.ts                # Vite build configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── eslint.config.js              # ESLint configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file


## Getting Started

To set up and run this project locally, please follow these steps:

### Prerequisites

-   Node.js (v18.x or higher recommended)
-   npm (or Yarn/pnpm)
-   A Supabase account and project
-   A Google Cloud project with Gemini API enabled
-   An EmailJS account

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd emran-9
2. Install Dependencies
Bash

npm install
# or yarn install
# or pnpm install
3. Configure Environment Variables
Create a .env.local file in the root directory of the project and add the following environment variables:

# Supabase Configuration
VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

# Google Gemini API Key
VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# EmailJS Configuration (for Contact Form and RFQ Notifications)
VITE_EMAILJS_SERVICE_ID="YOUR_EMAILJS_SERVICE_ID"
VITE_EMAILJS_TEMPLATE_ID="YOUR_EMAILJS_CONTACT_TEMPLATE_ID"
VITE_RFQ_EMAIL_TEMPLATE_ID="YOUR_EMAILJS_RFQ_TEMPLATE_ID" # Optional, if different template for RFQ
VITE_EMAILJS_PUBLIC_KEY="YOUR_EMAILJS_PUBLIC_KEY"
VITE_EMAILJS_TO_EMAIL="YOUR_COMPANY_RECEIVER_EMAIL" # Email address where contact forms and RFQs will be sent
Note: Ensure you replace the placeholder values with your actual API keys and URLs.

4. Set Up Supabase Project
a. Initialize Supabase CLI
First, install the Supabase CLI if you haven't already:

Bash

npm install -g supabase
Then, link your local project to your Supabase project:

Bash

supabase login
supabase link --project-ref your-project-ref
b. Run Migrations
Apply the database schema migrations to your Supabase project. These migrations will create all necessary tables, RLS policies, and functions.

Bash

supabase db push
c. Deploy Edge Functions
Deploy the Supabase Edge Functions for send-email and rfq-notification:

Bash

# First, ensure your .env.local variables are accessible by the CLI
# For send-email function
supabase functions deploy send-email --no-verify-jwt --env-file .env.local

# For rfq-notification function (if you want to handle RFQ notifications via Supabase Function)
supabase functions deploy rfq-notification --no-verify-jwt --env-file .env.local
Important: Make sure SUPABASE_SERVICE_ROLE_KEY is set in your Supabase project's secrets for the send-email and rfq-notification functions to access the database with elevated privileges.

d. Configure RLS (Row Level Security)
RLS policies are defined in the migration files (supabase/migrations/*.sql) and are applied with supabase db push. Verify these policies are correctly applied in your Supabase dashboard to ensure data security.

5. Start the Development Server
Bash

npm run dev
# or yarn dev
# or pnpm dev
The application should now be running at http://localhost:5173 (or another port if 5173 is in use).

6. Build for Production
Bash

npm run build
# or yarn build
# or pnpm build
This will create a dist directory with the optimized production build.

Usage
Public Website
Navigate to the deployed URL or http://localhost:5173 to browse the website. Explore the different service pages, learn about our company, view our portfolio, and use the contact form.

Chatbot
Click the chat icon on the bottom right to open the chatbot. You can ask questions about our services, materials, pricing, or even upload an image for AI analysis.

User Dashboard
Sign Up: Click "Sign Up" in the navigation bar to create an account.
Sign In: Log in with your credentials.
Access Dashboard: Once logged in, a "Dashboard" link will appear in the user menu. Here, you can log activities, set goals, and view your progress.
Admin Dashboard
To access the admin dashboard:

Log in with a user account.
Manually update the role column for your user's id in the profiles table within your Supabase dashboard to 'admin'.
Refresh the application. An "Admin Dashboard" link will now be visible in the user menu.
PWA Capabilities
This application is configured as a Progressive Web App (PWA). Once you visit the site, your browser may prompt you to install it. After installation, you can access the application directly from your device's home screen and benefit from offline caching.

Contributing
We welcome contributions! If you have suggestions for improvements or want to report a bug, please open an issue or submit a pull request.

License
This project is open-sourced under the MIT License. See the LICENSE file for more details.
