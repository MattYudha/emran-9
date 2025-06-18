import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  company: string;
  image: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, company, image }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="md:w-1/4 mb-6 md:mb-0">
        <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
          <div className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/30"></div>
          <img 
            src={image} 
            alt={author} 
            className="absolute w-full h-full object-cover rounded-full p-1"
          />
          <div className="absolute -top-2 -right-2 bg-green-600 p-2 rounded-full text-white">
            <Quote className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="md:w-3/4 text-center md:text-left">
        <p className="text-gray-600 dark:text-gray-300 text-lg italic mb-4">{quote}</p>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{author}</h4>
        <p className="text-green-600 dark:text-green-400">{company}</p>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    {
      quote: t.testimonial1,
      author: "John Smith",
      company: "ABC Corporation",
      image: "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: t.testimonial2,
      author: "Emily Wong",
      company: "XYZ Design Studio",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: t.testimonial3,
      author: "David Johnson",
      company: "Global Media",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextTestimonial = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.ourClients}
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
            {t.clientsSubtitle}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className={`transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <Testimonial
              quote={testimonials[currentIndex].quote}
              author={testimonials[currentIndex].author}
              company={testimonials[currentIndex].company}
              image={testimonials[currentIndex].image}
            />
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-green-600 dark:bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute -left-4 md:-left-12 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute -right-4 md:-right-12 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
