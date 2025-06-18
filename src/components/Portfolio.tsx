import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface PortfolioItemProps {
  id: number;
  image: string;
  title: string;
  category: string;
  onClick: () => void;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({ image, title, category, onClick }) => {
  return (
    <div 
      className="group cursor-pointer overflow-hidden rounded-lg shadow-md"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-green-900/60 dark:bg-gray-900/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <div className="text-white p-2 rounded-full bg-white/20 backdrop-blur-sm">
            <ZoomIn className="h-8 w-8" />
          </div>
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800">
        <p className="text-sm text-green-600 dark:text-green-400 mb-1">{category}</p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
    </div>
  );
};

const ImageModal: React.FC<{
  images: any[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  const currentImage = images[currentIndex];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <button 
          className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
          onClick={onClose}
        >
          ✕
        </button>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
          <img 
            src={currentImage.image} 
            alt={currentImage.title} 
            className="w-full h-auto"
            loading="lazy"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{currentImage.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{currentImage.category}</p>
          </div>
        </div>
        
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-colors"
          onClick={onPrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-colors"
          onClick={onNext}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

const Portfolio: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const portfolioItems = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/7319316/pexels-photo-7319316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: t.brandIdentityProject,
      category: "branding"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/6373305/pexels-photo-6373305.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: t.annualReport,
      category: "print"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/4466176/pexels-photo-4466176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: t.packagingDesign,
      category: "packaging"
    },
    {
      id: 4,
      image: "https://images.pexels.com/photos/5063095/pexels-photo-5063095.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: t.marketingMaterials,
      category: "print"
    },
    {
      id: 5,
      image: "https://images.pexels.com/photos/5076516/pexels-photo-5076516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: t.corporateBrochure,
      category: "print"
    },
    {
      id: 6,
      image: "https://images.pexels.com/photos/5078344/pexels-photo-5078344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: t.brandStationery,
      category: "branding"
    }
  ];

  const categories = [
    { id: 'all', name: t.all },
    { id: 'branding', name: t.branding },
    { id: 'print', name: t.print },
    { id: 'packaging', name: t.packaging }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredItems.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section id="portfolio" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.ourPortfolio}
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
            {t.portfolioSubtitle}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap justify-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <PortfolioItem
              key={item.id}
              id={item.id}
              image={item.image}
              title={item.title}
              category={categories.find(cat => cat.id === item.category)?.name || item.category}
              onClick={() => openModal(index)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ImageModal
          images={filteredItems}
          currentIndex={currentImageIndex}
          onClose={closeModal}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </section>
  );
};

export default Portfolio;
