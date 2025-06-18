import React from "react";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import {
  Palette,
  CheckCircle,
  Layers,
  Globe,
  BookOpen,
  Box,
  Rocket,
  Users,
} from "lucide-react";

const BrandIdentity: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const brandFeatures = [
    t.brandStrategy || "Comprehensive brand strategy development",
    t.logoDesign || "Custom logo design tailored to your vision",
    t.styleGuide || "Professional style guide and guidelines",
    t.implementation || "Full implementation across all media",
    t.typographySystem || "Custom typography system",
    t.colorPalette || "Strategic color palette development",
    t.brandVoice || "Brand voice and messaging guidelines",
    t.assetLibrary || "Complete digital asset library",
  ];

  const services = [
    {
      title: t.brandStrategy || "Brand Strategy",
      description:
        t.brandStrategyDesc ||
        "We develop your brand foundation including positioning, values, and personality",
      icon: <Globe className="h-6 w-6 text-green-500" />,
    },
    {
      title: t.visualIdentity || "Visual Identity",
      description:
        t.visualIdentityDesc ||
        "Logo, color palette, typography, and visual elements that represent your brand",
      icon: <Palette className="h-6 w-6 text-green-500" />,
    },
    {
      title: t.brandGuidelines || "Brand Guidelines",
      description:
        t.brandGuidelinesDesc ||
        "Comprehensive manual for consistent brand application across all touchpoints",
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
    },
    {
      title: t.brandCollateral || "Brand Collateral",
      description:
        t.brandCollateralDesc ||
        "Business cards, letterheads, presentations, and other essential materials",
      icon: <Box className="h-6 w-6 text-green-500" />,
    },
  ];

  const processSteps = [
    {
      title: t.discovery || "Discovery",
      description:
        t.discoveryDesc ||
        "We learn about your business, goals, and target audience",
      icon: <Rocket className="h-8 w-8 text-green-500" />,
    },
    {
      title: t.strategy || "Strategy",
      description:
        t.strategyDesc ||
        "Developing your brand positioning and messaging framework",
      icon: <Layers className="h-8 w-8 text-green-500" />,
    },
    {
      title: t.design || "Design",
      description:
        t.designDesc || "Creating visual identity concepts for your review",
      icon: <Palette className="h-8 w-8 text-green-500" />,
    },
    {
      title: t.implementation || "Implementation",
      description:
        t.implementationDesc ||
        "Applying the identity across all required materials and platforms",
      icon: <Users className="h-8 w-8 text-green-500" />,
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
                "url('https://images.pexels.com/photos/3183196/pexels-photo-3183196.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            }}
          >
            <div className="absolute inset-0 bg-green-900/60 dark:bg-gray-900/80 backdrop-blur-sm" />
          </div>
          <div className="container mx-auto px-4 h-full flex items-center relative">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t.brandIdentity || "Complete Brand Identity Solutions"}
              </h1>
              <p className="text-xl text-green-100">
                {t.brandHeroDesc ||
                  "We craft distinctive brand identities that resonate with your audience and differentiate you in the market."}
              </p>
            </div>
          </div>
        </div>

        {/* Intro Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              {t.whyBrandIdentity ||
                "Why Invest in Professional Brand Identity?"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t.brandIdentityDesc ||
                "A strong brand identity is more than just a logo - it's a complete system that communicates your values, builds recognition, and creates emotional connections with your audience. We develop comprehensive identities that work across all platforms and mediums."}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {brandFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
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

          {/* Services Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
              {t.ourServices || "Our Brand Identity Services"}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-green-100 dark:bg-gray-700 rounded-full">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
              {t.ourProcess || "Our Brand Development Process"}
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

          {/* Portfolio Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
              {t.ourWork || "Brand Identity Projects"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="h-48 bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-300">
                      Brand Project {item}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                      {t.brandExample || "Brand Identity"} {item}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t.brandExampleDesc ||
                        "Comprehensive brand identity including logo, colors, and guidelines"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-16 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              {t.readyToTransform || "Ready to transform your brand?"}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t.ctaDesc ||
                "Let's create a brand identity that tells your unique story and connects with your audience."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300"
              >
                {t.getStarted || "Get Started"}
              </a>
              <a
                href="#contact"
                className="inline-flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300"
              >
                {t.seePortfolio || "See Full Portfolio"}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Chatbot />
    </div>
  );
};

export default BrandIdentity;
