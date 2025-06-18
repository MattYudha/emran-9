import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: t.home, href: '#home' },
    { name: t.about, href: '#about' },
    { name: t.services, href: '#services' },
    { name: t.portfolio, href: '#portfolio' },
    { name: t.contact, href: '#contact' }
  ];
  
  const serviceLinks = [
    { name: t.digitalPrinting, href: '#services' },
    { name: t.offsetPrinting, href: '#services' },
    { name: t.largeFormat, href: '#services' },
    { name: t.designServices, href: '#services' },
    { name: t.packagingSolutions, href: '#services' }
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top footer section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company info */}
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-gray-400 mb-6">
              {t.footerAbout}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    <span className="mr-2">→</span> {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.ourServices}</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    <span className="mr-2">→</span> {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.newsletter}</h3>
            <p className="text-gray-400 mb-4">
              {t.newsletterText}
            </p>
            <form className="relative">
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                className="w-full py-3 px-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
              />
              <button 
                type="submit"
                className="absolute right-1 top-1 bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
        
        {/* Divider */}
        <hr className="border-gray-800 mb-6" />
        
        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Emran Ghani Asahi. {t.allRightsReserved}
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
              {t.privacyPolicy}
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
              {t.termsOfService}
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
              {t.cookiePolicy}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
