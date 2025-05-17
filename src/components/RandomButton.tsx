import React from 'react';
import { Shuffle } from 'lucide-react';
import { TeaStall } from '../types';

interface RandomButtonProps {
  stalls: TeaStall[];
  setSelectedStall: (stall: TeaStall | null) => void;
}

const RandomButton: React.FC<RandomButtonProps> = ({ stalls, setSelectedStall }) => {
  const selectRandomStall = () => {
    if (stalls.length > 0) {
      const randomIndex = Math.floor(Math.random() * stalls.length);
      const randomStall = stalls[randomIndex];
      setSelectedStall(randomStall);
      
      // Scroll to the top of the map section for mobile users
      const mapElement = document.getElementById('map-section');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <button 
      onClick={selectRandomStall}
      className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white py-3 px-6 rounded-full shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 font-medium"
    >
      <Shuffle className="h-5 w-5" />
      <span>Surprise Me!</span>
    </button>
  );
};

export default RandomButton;