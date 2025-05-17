import React from 'react';
import { TeaStall } from '../types';
import { MapPin, X } from 'lucide-react';

interface SelectedStallInfoProps {
  stall: TeaStall;
  onClose: () => void;
}

const SelectedStallInfo: React.FC<SelectedStallInfoProps> = ({ stall, onClose }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-l-4 border-green-600 dark:border-green-500 animate-fadeIn">
      <div className="relative">
        <img 
          src={stall.imageUrl} 
          alt={stall.name} 
          className="w-full h-48 object-cover"
        />
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-1 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-400">{stall.name}</h2>
        <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{stall.location}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{stall.description}</p>
        
        <div className="mb-4">
          <h3 className="font-semibold text-green-700 dark:text-green-500 mb-2">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {stall.specialties.map((specialty, index) => (
              <span 
                key={index} 
                className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-bold text-amber-600 dark:text-amber-500">{stall.rating}</span>
            <div className="ml-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < Math.floor(stall.rating) ? 'text-amber-500 dark:text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}>★</span>
              ))}
            </div>
          </div>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${stall.position[0]},${stall.position[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
};

export default SelectedStallInfo;