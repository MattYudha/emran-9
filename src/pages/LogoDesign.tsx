import React from "react";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import { CheckCircle, Palette, Rocket, Layers, Shield } from "lucide-react";

const LogoDesign: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const logoFeatures = [
    t.customLogo || "Fully custom logo design",
    t.unlimitedRevisions || "Unlimited revisions until perfect",
    t.vectorFiles || "High-quality vector files included",
    t.freeConsultation || "Free initial consultation",
    t.multipleFormats || "Delivered in multiple formats (PNG, JPG, SVG, EPS)",
    t.fullOwnership || "Full ownership rights",
  ];

  const processSteps = [
    {
      title: t.consultation || "Consultation",
      description:
        t.consultationDesc ||
        "We discuss your brand, vision, and design preferences",
      icon: <Palette className="h-8 w-8 text-green-500" />,
    },
    {
      title: t.conceptDevelopment || "Concept Development",
      description:
        t.conceptDesc ||
        "Our designers create initial logo concepts based on your brief",
      icon: <Layers className="h-8 w-8 text-green-500" />,
    },
    {
      title: t.revisionRound || "Revision Round",
      description:
        t.revisionDesc || "We refine the chosen concept based on your feedback",
      icon: <Rocket className="h-8 w-8 text-green-500" />,
    },
    {
      title: t.finalDelivery || "Final Delivery",
      description:
        t.deliveryDesc ||
        "You receive all file formats and full ownership of the logo",
      icon: <Shield className="h-8 w-8 text-green-500" />,
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className="relative h-[400px] mb-12">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/3183198/pexels-photo-3183198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            }}
          >
            <div className="absolute inset-0 bg-green-900/60 dark:bg-gray-900/80 backdrop-blur-sm" />
          </div>
          <div className="container mx-auto px-4 h-full flex items-center relative">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t.logoDesign || "Professional Logo Design Services"}
              </h1>
              <p className="text-xl text-green-100">
                {t.logoHeroDesc ||
                  "Crafting unique brand identities that make lasting impressions. Our custom logos are designed to elevate your business."}
              </p>
            </div>
          </div>
        </div>

        {/* Intro Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              {t.whyInvest || "Why Invest in a Professional Logo?"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t.logoDesc ||
                "Your logo is often the first impression customers have of your brand. We create memorable, scalable logos that communicate your brand values and stand the test of time. Our process combines strategic thinking with creative excellence to deliver logos that work across all mediums."}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {logoFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <p className="text-gray-800 dark:text-white font-medium">
                    {feature}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Process Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
              {t.ourProcess || "Our Logo Design Process"}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-green-100 dark:bg-gray-700 rounded-full">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md px-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
              {t.pricing || "Simple, Transparent Pricing"}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  {t.basic || "Basic"}
                </h3>
                <p className="text-3xl font-bold text-green-600 mb-4">$199</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>2 initial concepts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>3 revision rounds</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Standard file formats</span>
                  </li>
                </ul>
                <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg font-medium">
                  {t.getStarted || "Get Started"}
                </button>
              </div>

              <div className="border-2 border-green-500 rounded-lg p-6 relative">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  {t.popular || "Popular"}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  {t.premium || "Premium"}
                </h3>
                <p className="text-3xl font-bold text-green-600 mb-4">$399</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>5 initial concepts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Unlimited revisions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>All file formats + vector files</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Brand style guide</span>
                  </li>
                </ul>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors">
                  {t.getStarted || "Get Started"}
                </button>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  {t.enterprise || "Enterprise"}
                </h3>
                <p className="text-3xl font-bold text-green-600 mb-4">$799+</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Complete brand identity</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Unlimited concepts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Stationery design</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Social media kit</span>
                  </li>
                </ul>
                <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg font-medium">
                  {t.contactUs || "Contact Us"}
                </button>
              </div>
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
              {t.ourWork || "Our Logo Portfolio"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center"
                >
                  <div className="h-40 w-full bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-300">
                      Logo {item}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-16 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              {t.readyToStart || "Ready to create your perfect logo?"}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t.ctaDesc ||
                "Let's discuss how we can create a logo that perfectly represents your brand and resonates with your audience."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300"
              >
                {t.startProject || "Start Your Project"}
              </a>
              <a
                href="#contact"
                className="inline-flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300"
              >
                {t.contactUs || "Contact Us"}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Chatbot />
    </div>
  );
};

export default LogoDesign;
