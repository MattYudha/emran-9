import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import {
  FileText,
  CheckCircle,
  Eye,
  Zap,
  DollarSign,
  Truck,
  LayoutTemplate,
  Palette,
  Globe,
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Flyers: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const flyerFeatures = [
    {
      icon: <Eye className="h-6 w-6 text-green-500" />,
      title: t.eyeCatchingDesign || "Captivating Designs",
      description:
        t.eyeCatchingDesignDesc ||
        "Our graphic designers create visually striking flyers that grab attention and communicate your message effectively",
    },
    {
      icon: <Zap className="h-6 w-6 text-green-500" />,
      title: t.quickPrinting || "Rapid Turnaround",
      description:
        t.quickPrintingDesc ||
        "Same-day printing available for urgent campaigns with our express service options",
    },
    {
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      title: t.affordablePricing || "Competitive Pricing",
      description:
        t.affordablePricingDesc ||
        "High-quality printing at budget-friendly prices with volume discounts available",
    },
    {
      icon: <Truck className="h-6 w-6 text-green-500" />,
      title: t.easyDistribution || "Nationwide Delivery",
      description:
        t.easyDistributionDesc ||
        "We can deliver your flyers directly to your locations or handle distribution for you",
    },
  ];

  const flyerTypes = [
    {
      name: "Event Flyers",
      icon: <LayoutTemplate className="h-8 w-8" />,
      desc: "Promote concerts, festivals, and gatherings",
    },
    {
      name: "Sales Flyers",
      icon: <DollarSign className="h-8 w-8" />,
      desc: "Highlight promotions and special offers",
    },
    {
      name: "Real Estate",
      icon: <FileText className="h-8 w-8" />,
      desc: "Showcase properties and open houses",
    },
    {
      name: "Political",
      icon: <Globe className="h-8 w-8" />,
      desc: "Campaign materials for elections",
    },
    {
      name: "Restaurant",
      icon: <Palette className="h-8 w-8" />,
      desc: "Menu specials and grand openings",
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
          className="relative h-[450px] md:h-[500px] mb-16 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1637&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-blue-800/70 dark:from-gray-900/90 dark:to-gray-800/80" />
          </div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {t.flyers || "Professional Flyer Printing"}
              </h1>
              <p className="text-xl text-green-100 dark:text-green-200">
                {t.flyerSubtitle ||
                  "Amplify your message with high-impact marketing materials"}
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Introduction Section */}
        <motion.section
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeIn}
          className="container mx-auto px-4 py-16"
        >
          <div className="max-w-5xl mx-auto text-center mb-16">
            <FileText className="h-12 w-12 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
              {t.flyerHeading || "Powerful Print Marketing"}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t.flyerDesc ||
                "In a digital world, printed flyers remain one of the most effective ways to reach your audience. Our premium printing services combine vibrant colors, superior paper stocks, and expert finishing to create marketing materials that demand attention and drive results."}
            </p>
          </div>

          {/* Features Grid with Animation */}
          <div className="grid md:grid-cols-2 gap-10 mb-20">
            {flyerFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                custom={index}
                initial="hidden"
                animate={controls}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-start mb-4">
                  <div className="p-2 bg-green-50 dark:bg-gray-700 rounded-lg mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Flyer Types Carousel */}
          <div className="mb-20 overflow-hidden">
            <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-10">
              {t.flyerTypesTitle || "Our Flyer Specialties"}
            </h3>
            <div className="flex overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
              <div className="flex space-x-6">
                {flyerTypes.map((type, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="h-40 bg-gradient-to-br from-green-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                      {type.icon}
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                        {type.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {type.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Animated CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-600 dark:to-blue-600 p-0.5 rounded-full inline-block mb-8">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="inline-flex items-center bg-white dark:bg-gray-900 text-green-600 dark:text-white hover:bg-opacity-90 font-semibold text-lg py-4 px-10 rounded-full transition-all duration-300"
              >
                {t.getQuote || "Get a Free Quote"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.a>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t.ctaSubtext ||
                "Includes free digital proof and design consultation"}
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="grid md:grid-cols-3 gap-8 bg-green-600 dark:bg-green-700 rounded-2xl p-10 text-white mb-20"
          >
            {[
              { number: "500+", label: "Flyer Designs" },
              { number: "24h", label: "Turnaround" },
              { number: "10k+", label: "Flyers Printed Monthly" },
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeIn} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-green-100">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>
      <Chatbot />
    </div>
  );
};

export default Flyers;
