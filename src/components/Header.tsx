import React from 'react';
import { Coffee as Mug } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-green-800 to-green-700 dark:from-gray-900 dark:to-gray-800 text-white p-4 shadow-md transition-colors">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-3 sm:mb-0">
          <Mug className="h-8 w-8 mr-2 text-amber-300 dark:text-amber-400" />
          <h1 className="text-2xl font-bold">Chaya Spotter</h1>
        </div>
        <div>
          <p className="text-lg italic text-amber-200 dark:text-amber-300">Find your next chaya spot ☕</p>
        </div>
      </div>
    </header>
  );
};

export default Header;