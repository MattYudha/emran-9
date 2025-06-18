import React from 'react';
import { Printer } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Logo: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="flex items-center">
      <Printer className="h-8 w-8 text-green-400 mr-2" />
      <span className="font-bold text-xl text-white">
        <span className="text-green-300">E</span>G Asahi
      </span>
    </div>
  );
};

export default Logo;
