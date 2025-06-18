import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import {
  Image,
  CheckCircle,
  Palette,
  Printer,
  Shield,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Posters: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const posterImages = [
    {
      url: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Event Posters",
      description: "Professional event and promotional posters",
    },
    {
      url: "https://images.pexels.com/photos/5662857/pexels-photo-5662857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Business Posters",
      description: "Corporate and marketing materials",
    },
    {
      url: "https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Retail Posters",
      description: "Sales and promotional displays",
    },
  ];

  const posterFeatures = [
    {
      icon: <Palette className="h-6 w-6" />,
      title: t.creativeDesign || "Creative Design",
      description:
        "Bold and eye-catching designs that capture attention and effectively communicate your message.",
    },
    {
      icon: <Printer className="h-6 w-6" />,
      title: t.largeFormat || "Large Format Printing",
      description:
        "Advanced printing technology for sizes from A4 up to large billboard formats with exceptional quality.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t.durableMaterials || "Premium Materials",
      description:
        "High-quality materials including weather-resistant options for long-lasting vibrant appearance.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: t.vibrantColors || "Vibrant Colors",
      description:
        "Advanced color technology delivers stunning, sharp details that make your posters stand out.",
    },
  ];

  const posterSizes = [
    { size: "A4", dimensions: "210 x 297mm", price: "From $15" },
    { size: "A3", dimensions: "297 x 420mm", price: "From $25" },
    { size: "A2", dimensions: "420 x 594mm", price: "From $35" },
    { size: "A1", dimensions: "594 x 841mm", price: "From $45" },
    { size: "A0", dimensions: "841 x 1189mm", price: "From $65" },
    { size: "Custom", dimensions: "Any size", price: "Quote on request" },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % posterImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % posterImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + posterImages.length) % posterImages.length
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        {/* Hero Section with Slider */}
        <div className="relative h-[400px] mb-12 overflow-hidden">
          <div className="relative h-full">
            {posterImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${image.url}')` }}
                >
                  <div className="absolute inset-0 bg-green-900/70 dark:bg-gray-900/80 backdrop-blur-sm" />
                </div>
                <div className="container mx-auto px-4 h-full flex items-center relative">
                  <div
                    className={`max-w-2xl transform transition-all duration-1000 ${
                      index === currentSlide
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      {index === 0
                        ? t.posters || "Professional Poster Printing"
                        : image.title}
                    </h1>
                    <p className="text-lg text-white/90 mb-6">
                      {image.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {posterImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Description */}
            <div
              className={`text-center mb-12 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                Professional Poster Solutions
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t.posterDesc ||
                  "Create impactful promotional materials with our professional poster printing services. From design to delivery, we ensure your message stands out with vibrant colors and premium quality materials."}
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {posterFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center mb-4">
                    <div className="text-green-600 mr-3">{feature.icon}</div>
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Sizes & Pricing */}
            <div
              className={`mb-16 transform transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
                Available Sizes & Pricing
              </h3>
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
                {posterSizes.map((size, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
                  >
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {size.size}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {size.dimensions}
                    </div>
                    <div className="text-lg font-semibold text-gray-800 dark:text-white">
                      {size.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div
              className={`mb-16 transform transition-all duration-1000 delay-400 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
                Material Options
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-3">
                    Standard Paper
                  </h4>
                  <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>• High-quality glossy/matte finish</li>
                    <li>• Indoor use recommended</li>
                    <li>• Cost-effective solution</li>
                    <li>• Quick turnaround time</li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-3">
                    Vinyl Banner
                  </h4>
                  <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>• Weather-resistant material</li>
                    <li>• Perfect for outdoor use</li>
                    <li>• Durable and long-lasting</li>
                    <li>• UV and fade resistant</li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-3">
                    Foam Board
                  </h4>
                  <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    <li>• Rigid and lightweight</li>
                    <li>• Professional presentation</li>
                    <li>• Easy to mount and display</li>
                    <li>• Reusable for events</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`text-center bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 transform transition-all duration-1000 delay-500 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <Image className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Create Your Poster?
              </h3>
              <p className="text-white/90 mb-6">
                Get professional poster printing that makes your message stand
                out
              </p>
              <a
                href="#contact"
                className="inline-flex items-center bg-white hover:bg-gray-100 text-green-600 font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
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

export default Posters;
