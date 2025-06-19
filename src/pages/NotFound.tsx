import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

const NotFound: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center text-center px-4 py-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-6xl font-extrabold text-green-600 dark:text-green-400 mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {t.notFoundTitle || 'Halaman Tidak Ditemukan'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {t.notFoundDescription || 'Maaf, halaman yang Anda cari tidak ada. Mungkin telah dihapus atau Anda salah mengetik alamatnya.'}
          </p>
          <a
            href="/"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
          >
            {t.home || 'Kembali ke Beranda'}
          </a>
        </div>
      </main>
      <Chatbot />
      {/* Footer akan ditambahkan oleh App.tsx */}
    </div>
  );
};

export default NotFound; // PASTIKAN BARIS INI ADA