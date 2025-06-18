import React from "react";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import { CheckCircle, Palette, Brush, BookOpen, Megaphone } from "lucide-react";

const Illustration: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const illustrationFeatures = [
    {
      icon: <Brush className="h-6 w-6 text-green-500" />,
      title: t.handDrawn || "Hand-drawn & Digital",
      description:
        t.handDrawnDesc ||
        "Unique illustrations crafted traditionally or digitally",
    },
    {
      icon: <Palette className="h-6 w-6 text-green-500" />,
      title: t.customStyles || "Custom Styles",
      description:
        t.customStylesDesc ||
        "Tailored to match your brand identity and vision",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      title: t.multiPurpose || "Versatile Applications",
      description:
        t.multiPurposeDesc ||
        "Perfect for books, packaging, web, and marketing materials",
    },
    {
      icon: <Megaphone className="h-6 w-6 text-green-500" />,
      title: t.freeRevisions || "Collaborative Process",
      description:
        t.freeRevisionsDesc ||
        "Revisions included to ensure complete satisfaction",
    },
  ];

  const portfolioItems = [
    {
      title: "Editorial Illustrations",
      description:
        t.editorialDesc || "Engaging visuals for magazines and articles",
      image:
        "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Book Illustrations",
      description:
        t.bookDesc || "Compelling artwork for children's and adult books",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Product Illustrations",
      description:
        t.productDesc || "Eye-catching designs for packaging and merchandise",
      image:
        "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] mb-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/3648855/pexels-photo-3648855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            }}
          >
            <div className="absolute inset-0 bg-green-900/70 dark:bg-gray-900/90" />
          </div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-start relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-2xl">
              {t.illustrationService || "Professional Illustration Services"}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              {t.illustrationDesc ||
                "Transform your ideas into captivating visual stories with our bespoke illustration solutions."}
            </p>
            <a
              href="#contact"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              {t.getStarted || "Get Started"}
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {t.whyChooseUs || "Why Choose Our Illustration Services"}
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {illustrationFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Portfolio Showcase */}
        <section className="bg-gray-100 dark:bg-gray-800 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                {t.ourWork || "Our Illustration Portfolio"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t.portfolioDesc ||
                  "Explore our diverse range of illustration projects across various industries."}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-xl bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t.readyToStart || "Ready to Bring Your Vision to Life?"}
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              {t.ctaDesc ||
                "Contact us today to discuss your illustration project and receive a free consultation."}
            </p>
            <a
              href="#contact"
              className="inline-block bg-white text-green-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              {t.contactUs || "Contact Our Team"}
            </a>
          </div>
        </section>
      </main>
      <Chatbot />
    </div>
  );
};

export default Illustration;
