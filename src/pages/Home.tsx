import React from "react";
import Navbar from "../components/Navbar.tsx";
import Hero from "../components/Hero.tsx";
import Services from "../components/Services.tsx";
import About from "../components/About.tsx";
import Team from "../components/Team.tsx";
import Portfolio from "../components/Portfolio.tsx";
import Contact from "../components/Contact.tsx";
import Chatbot from "../components/Chatbot.tsx";
import { useLanguage } from "../contexts/LanguageContext.tsx";
import { translations } from "../utils/translations.ts";

const Home: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Team />
        <Portfolio />
        <Contact />
      </main>
      <Chatbot />
    </div>
  );
};

export default Home;
