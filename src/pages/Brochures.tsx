import React from "react";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import {
  Book,
  CheckCircle,
  Palette,
  Printer,
  Ruler,
  Award,
} from "lucide-react";

const Brochures: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const brochureFeatures = [
    {
      icon: <Palette className="h-6 w-6 text-green-500" />,
      title: t.customDesign || "Custom Design",
      description:
        t.customDesignDesc ||
        "Tailored designs that perfectly represent your brand identity and message",
    },
    {
      icon: <Printer className="h-6 w-6 text-green-500" />,
      title: t.highQualityPrint || "Premium Printing",
      description:
        t.highQualityPrintDesc ||
        "Crisp, vibrant prints on premium paper stocks for maximum impact",
    },
    {
      icon: <Ruler className="h-6 w-6 text-green-500" />,
      title: t.variousSizes || "Versatile Formats",
      description:
        t.variousSizesDesc ||
        "From tri-fold to bi-fold, we offer all standard brochure sizes and custom dimensions",
    },
    {
      icon: <Award className="h-6 w-6 text-green-500" />,
      title: t.finishingOptions || "Professional Finishes",
      description:
        t.finishingOptionsDesc ||
        "Spot UV, foil stamping, embossing and other premium finishing options",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[400px] mb-16 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1541140134513-85a161dc4a00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-700/60 dark:from-gray-900/90 dark:to-gray-800/80" />
          </div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {t.brochures || "Professional Brochure Printing"}
              </h1>
              <p className="text-xl text-green-100 dark:text-green-200">
                {t.brochureSubtitle ||
                  "Make a lasting impression with premium quality brochures"}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
              {t.brochureHeading || "Elevate Your Marketing Materials"}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t.brochureDesc ||
                "In today's competitive market, a well-designed brochure serves as your silent salesperson. Our expert design team and state-of-the-art printing technology combine to create brochures that captivate your audience and effectively communicate your value proposition."}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-10 mb-20">
            {brochureFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-start mb-4">
                  <div className="p-2 bg-green-50 dark:bg-gray-700 rounded-lg mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-0.5 rounded-full inline-block mb-8">
              <a
                href="#contact"
                className="inline-flex items-center bg-white dark:bg-gray-900 text-green-600 dark:text-white hover:bg-opacity-90 font-semibold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                {t.orderNow || "Request a Quote"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t.ctaSubtext ||
                "Get a free consultation with our design experts"}
            </p>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="bg-gray-100 dark:bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Book className="h-12 w-12 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
                {t.brochureTypesTitle || "Our Brochure Solutions"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t.brochureTypesDesc ||
                  "We specialize in various brochure types including corporate brochures, product catalogs, service guides, and event programs. Each is crafted with attention to detail to ensure your message stands out."}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  "Tri-Fold",
                  "Bi-Fold",
                  "Gate Fold",
                  "Z-Fold",
                  "Roll Fold",
                ].map((type) => (
                  <span
                    key={type}
                    className="bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Chatbot />
    </div>
  );
};

export default Brochures;
