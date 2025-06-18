import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

interface ServicePageProps {
  title: string;
  description: string;
  image: string;
  features: string[];
}

const ServicePage: React.FC<ServicePageProps> = ({ title, description, image, features }) => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="pt-20">
      <div className="relative h-[300px] mb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container mx-auto px-4 h-full flex items-center relative">
          <h1 className="text-4xl md:text-5xl font-bold text-white">{title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {description}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2" />
                  <p className="text-gray-800 dark:text-white font-medium">
                    {feature}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="#contact"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300"
            >
              {t.contactUs}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
