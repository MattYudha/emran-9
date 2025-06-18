import React from "react";
import { useLanguage } from "../contexts/LanguageContext.tsx";
import { translations } from "../utils/translations.ts";
import { ArrowDown } from "lucide-react";

const Hero: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section
      id="home"
      className="relative h-screen flex items-center overflow-hidden"
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://printondemand.co.id/wp-content/uploads/2023/06/printing-house.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-green-900/60 dark:bg-gray-900/80 backdrop-blur-sm"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
            {t.heroTitle} <span className="text-green-300">{t.printing}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 animate-fade-in-up animation-delay-200">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
            <a
              href="#services"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 text-center"
            >
              {t.exploreServices}
            </a>
            <a
              href="#contact"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg border border-white/30 transition-all duration-300 text-center"
            >
              {t.contactUs}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <a
        href="#services"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center animate-bounce"
      >
        <span className="text-sm mb-2">{t.scrollDown}</span>
        <ArrowDown className="h-5 w-5" />
      </a>
    </section>
  );
};

export default Hero;
