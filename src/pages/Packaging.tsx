import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import {
  Package,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Palette,
  Leaf,
  Award,
  Zap,
} from "lucide-react";

const Packaging: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const packagingImages = [
    {
      url: "https://images.pexels.com/photos/5063096/pexels-photo-5063096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Custom Box Packaging",
      description: "Premium quality custom boxes for all your products",
    },
    {
      url: "https://images.pexels.com/photos/4386433/pexels-photo-4386433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Eco-Friendly Solutions",
      description:
        "Sustainable packaging materials that protect the environment",
    },
    {
      url: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Brand Enhancement",
      description: "Beautiful designs that elevate your brand presence",
    },
    {
      url: "https://images.pexels.com/photos/4428145/pexels-photo-4428145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Industrial Packaging",
      description: "Heavy-duty solutions for industrial and commercial use",
    },
  ];

  const packagingFeatures = [
    {
      title: t.creativeDesign || "Creative Design",
      description:
        "Unique and eye-catching packaging designs that make your products stand out in the market",
      icon: <Palette className="h-8 w-8 text-green-500" />,
    },
    {
      title: t.ecoFriendly || "Eco-Friendly Materials",
      description:
        "Sustainable packaging solutions using recyclable and biodegradable materials",
      icon: <Leaf className="h-8 w-8 text-green-500" />,
    },
    {
      title: t.customPackaging || "Custom Solutions",
      description:
        "Tailored packaging solutions designed specifically for your product requirements",
      icon: <Package className="h-8 w-8 text-green-500" />,
    },
    {
      title: t.qualityPrinting || "Premium Quality Printing",
      description:
        "High-resolution printing with premium finishes for professional presentation",
      icon: <Award className="h-8 w-8 text-green-500" />,
    },
  ];

  const stats = [
    { number: "500+", label: "Projects Completed" },
    { number: "50+", label: "Happy Clients" },
    { number: "10+", label: "Years Experience" },
    { number: "24/7", label: "Support Available" },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % packagingImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % packagingImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + packagingImages.length) % packagingImages.length
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        {/* Hero Section with Slider */}
        <div className="relative h-[500px] mb-12 overflow-hidden">
          <div className="relative h-full">
            {packagingImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
                  index === currentSlide
                    ? "translate-x-0"
                    : index ===
                      (currentSlide - 1 + packagingImages.length) %
                        packagingImages.length
                    ? "-translate-x-full"
                    : "translate-x-full"
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${image.url}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-green-800/60 to-transparent dark:from-gray-900/90 dark:via-gray-800/70" />
                </div>
                <div className="container mx-auto px-4 h-full flex items-center relative">
                  <div
                    className={`max-w-2xl transform transition-all duration-1000 delay-300 ${
                      index === currentSlide
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                      {index === 0
                        ? t.packaging || "Packaging Solutions"
                        : image.title}
                    </h1>
                    <p className="text-xl text-white/90 mb-6">
                      {image.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <Package className="h-8 w-8 text-green-400" />
                      <span className="text-green-400 font-semibold">
                        Premium Quality Guaranteed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {packagingImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div
          className={`container mx-auto px-4 py-12 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform transition-all duration-700 hover:scale-105"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold">{stat.number}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Description */}
            <div
              className={`text-center mb-16 transform transition-all duration-1000 delay-200 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                Why Choose Our Packaging Solutions?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {t.packagingDesc ||
                  "Enhance your product with our custom packaging solutions. From design to production, we deliver durable and attractive packaging that stands out in the market and protects your products during transportation."}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {packagingFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{ animationDelay: `${(index + 3) * 200}ms` }}
                >
                  <div className="flex items-start mb-6">
                    <div className="p-2 bg-green-50 dark:bg-gray-700 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"></div>
                </div>
              ))}
            </div>

            {/* Process Timeline */}
            <div
              className={`mb-16 transform transition-all duration-1000 delay-600 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
                Our Process
              </h3>
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  {
                    step: "1",
                    title: "Consultation",
                    desc: "Understanding your needs",
                    icon: <Package className="h-6 w-6" />,
                  },
                  {
                    step: "2",
                    title: "Design",
                    desc: "Creating custom solutions",
                    icon: <Palette className="h-6 w-6" />,
                  },
                  {
                    step: "3",
                    title: "Production",
                    desc: "Manufacturing with quality",
                    icon: <Award className="h-6 w-6" />,
                  },
                  {
                    step: "4",
                    title: "Delivery",
                    desc: "On-time delivery guaranteed",
                    icon: <Zap className="h-6 w-6" />,
                  },
                ].map((process, index) => (
                  <div key={index} className="text-center group">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {process.step}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {process.icon}
                        </div>
                      </div>
                      {index < 3 && (
                        <div className="hidden md:block absolute top-8 left-16 w-full h-0.5 bg-gradient-to-r from-green-500 to-green-300"></div>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                      {process.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {process.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div
              className={`text-center bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 transform transition-all duration-1000 delay-800 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Enhance Your Product?
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Get professional packaging solutions that protect your products
                and elevate your brand presence.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center bg-white hover:bg-gray-100 text-green-600 font-bold py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Package className="h-5 w-5 mr-2" />
                {t.contactUs || "Get Started Today"}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Chatbot />
    </div>
  );
};

export default Packaging;
