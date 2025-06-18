import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import { CheckCircle } from "lucide-react";

const About: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const features = [t.feature1, t.feature2, t.feature3, t.feature4];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image section */}
          <div className="lg:w-1/2 relative">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="assets/theavenue.jpg"
                alt="Modern printing facility"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-green-600 text-white p-4 rounded-lg shadow-lg hidden md:block">
              <p className="text-xl font-bold">{t.yearsExperience}</p>
              <p>{t.inPrinting}</p>
            </div>
          </div>

          {/* Content section */}
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t.aboutTitle}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              {t.aboutDescription1}
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              {t.aboutDescription2}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-200">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300"
            >
              {t.learnMore}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
