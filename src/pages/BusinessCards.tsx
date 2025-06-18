import React from "react";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import { IdCard, CheckCircle } from "lucide-react";

const BusinessCards: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const businessCardFeatures = [
    t.premiumMaterials || "Premium materials for durability",
    t.customDesigns || "Fully customizable designs",
    t.fastDelivery || "Fast and reliable delivery",
    t.professionalFinish || "Professional finishing options",
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        <div className="relative h-[300px] mb-12">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            }}
          >
            <div className="absolute inset-0 bg-green-900/60 dark:bg-gray-900/80 backdrop-blur-sm" />
          </div>
          <div className="container mx-auto px-4 h-full flex items-center relative">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {t.businessCards || "Business Card Printing Services"}
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t.businessCardDesc ||
                "Make a lasting impression with our high-quality business card printing services. Customize your cards with unique designs and premium finishes to reflect your professional identity."}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {businessCardFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-gray-800 dark:text-white font-medium">
                      {feature}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="#contact"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300"
              >
                {t.orderNow || "Order Now"}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Chatbot />
    </div>
  );
};

export default BusinessCards;
