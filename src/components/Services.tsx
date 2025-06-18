import React from 'react';
import { Printer, PenTool, Palette, Package, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  route: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, route }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center text-center group">
      <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{description}</p>
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 w-full">
        <Link 
          to={route}
          className="text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200 inline-flex items-center"
        >
          Learn more 
          <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

const Services: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const services = [
    {
      icon: <Printer className="h-6 w-6" />,
      title: t.digitalPrinting,
      description: t.digitalPrintingDesc,
      route: "/business-cards"
    },
    {
      icon: <PenTool className="h-6 w-6" />,
      title: t.offsetPrinting,
      description: t.offsetPrintingDesc,
      route: "/brochures"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: t.largeFormat,
      description: t.largeFormatDesc,
      route: "/banners"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: t.packagingSolutions,
      description: t.packagingSolutionsDesc,
      route: "/packaging"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: t.designServices,
      description: t.designServicesDesc,
      route: "/logo-design"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.ourServices}
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
            {t.servicesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              route={service.route}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
