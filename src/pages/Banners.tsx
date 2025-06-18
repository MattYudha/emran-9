import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import {
  ArrowRight,
  CheckCircle,
  Truck,
  Clock,
  Palette,
  Scissors,
  Zap,
  Shield,
  Eye,
  Ruler,
  CloudRain,
  Leaf,
  Percent,
  Layout,
  Image,
  Phone,
  Mail,
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Banners: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const bannerFeatures = [
    {
      icon: <Eye className="h-6 w-6 text-green-500" />,
      title: t.highQualityPrinting || "Vibrant Printing",
      description:
        t.highQualityPrintingDesc ||
        "High-resolution printing with color-matched accuracy for maximum visual impact",
    },
    {
      icon: <Ruler className="h-6 w-6 text-green-500" />,
      title: t.customSizes || "Custom Dimensions",
      description:
        t.customSizesDesc ||
        "Any size up to 5m wide with seamless stitching for extra large banners",
    },
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: t.durableMaterials || "Premium Materials",
      description:
        t.durableMaterialsDesc ||
        "13oz vinyl, mesh, and fabric options for every application",
    },
    {
      icon: <Zap className="h-6 w-6 text-green-500" />,
      title: t.fastTurnaround || "Rush Service",
      description:
        t.fastTurnaroundDesc ||
        "Same-day printing available for urgent projects",
    },
    {
      icon: <CloudRain className="h-6 w-6 text-green-500" />,
      title: t.weatherResistant || "All-Weather",
      description:
        t.weatherResistantDesc ||
        "UV-protected inks and waterproof materials for outdoor durability",
    },
    {
      icon: <Palette className="h-6 w-6 text-green-500" />,
      title: t.fullDesignSupport || "Design Services",
      description:
        t.fullDesignSupportDesc ||
        "Our creative team will design your banner from concept to completion",
    },
    {
      icon: <Leaf className="h-6 w-6 text-green-500" />,
      title: t.ecoFriendlyOptions || "Eco Materials",
      description:
        t.ecoFriendlyOptionsDesc ||
        "Recyclable vinyl and biodegradable banner options available",
    },
    {
      icon: <Percent className="h-6 w-6 text-green-500" />,
      title: t.bulkDiscounts || "Volume Savings",
      description:
        t.bulkDiscountsDesc ||
        "Special pricing for large orders and repeat customers",
    },
  ];

  const bannerTypes = [
    {
      name: t.vinylBanners || "Vinyl Banners",
      description:
        t.vinylBannerDesc ||
        "Heavy-duty, weather-resistant banners with reinforced edges and grommets",
      icon: <Shield className="h-8 w-8 text-green-500" />,
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
    },
    {
      name: t.fabricBanners || "Fabric Banners",
      description:
        t.fabricBannerDesc ||
        "Luxury matte finish with wrinkle-resistant properties for elegant displays",
      icon: <Palette className="h-8 w-8 text-green-500" />,
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    },
    {
      name: t.retractableBanners || "Retractable Banners",
      description:
        t.retractableBannerDesc ||
        "Professional pop-up displays with carrying case, perfect for mobile marketing",
      icon: <Scissors className="h-8 w-8 text-green-500" />,
      image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc",
    },
    {
      name: t.xStandBanners || "X-Stand Banners",
      description:
        t.xStandBannerDesc ||
        "Freestanding displays with sturdy aluminum frames for high-traffic areas",
      icon: <Layout className="h-8 w-8 text-green-500" />,
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        {/* Animated Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[500px] mb-16 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-green-800/70 dark:from-gray-900/90 dark:to-gray-800/80" />
          </div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {t.banners || "Premium Banner Solutions"}
              </h1>
              <p className="text-xl text-green-100 dark:text-green-200">
                {t.bannerHeroDesc ||
                  "Make a bold statement with our high-impact, durable banners"}
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="inline-flex items-center mt-8 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
              >
                {t.requestQuote || "Get a Free Quote"}
                <ArrowRight className="h-5 w-5 ml-2" />
              </motion.a>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
          className="container mx-auto px-4 py-16"
        >
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6"
            >
              {t.whyOurBanners || "Industry-Leading Banner Quality"}
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-600 dark:text-gray-300"
            >
              {t.bannerDescription ||
                "From trade shows to storefronts, our banners deliver unmatched durability and visual appeal with precision printing on premium materials."}
            </motion.p>
          </div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          >
            {bannerFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-green-100 dark:bg-gray-700 rounded-lg mr-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-auto">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Banner Types Section */}
          <div className="py-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-16"
            >
              {t.bannerTypes || "Our Banner Products"}
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {bannerTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-green-100 dark:bg-gray-700 rounded-lg mr-4">
                        {type.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {type.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {type.description}
                    </p>
                    <button className="mt-4 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium text-sm transition-colors">
                      {t.viewOptions || "View Options"} →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-2xl p-10 text-center mb-20"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              {t.readyToOrder || "Need Custom Banners?"}
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              {t.ctaDesc ||
                "Our experts will help you choose the perfect banner solution for your needs."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="inline-flex items-center bg-white hover:bg-gray-100 text-green-600 font-medium py-3 px-8 rounded-lg transition-all duration-300"
              >
                <Phone className="h-5 w-5 mr-2" />
                {t.callUs || "Call Us Now"}
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="inline-flex items-center bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
              >
                <Mail className="h-5 w-5 mr-2" />
                {t.emailUs || "Email Inquiry"}
              </motion.a>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-lg mb-20"
          >
            {[
              {
                number: "10,000+",
                label: t.bannersPrinted || "Banners Printed",
              },
              {
                number: "24h",
                label: t.fastestTurnaround || "Fastest Turnaround",
              },
              {
                number: "98%",
                label: t.clientSatisfaction || "Client Satisfaction",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>
      <Chatbot />
    </div>
  );
};

export default Banners;
