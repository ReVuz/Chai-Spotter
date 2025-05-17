import React from 'react';
import { Bean as Tea, Star } from 'lucide-react';
import { TeaStall } from '../types';

interface TeaStallCardProps {
  stall: TeaStall;
  compact?: boolean;
}

const TeaStallCard: React.FC<TeaStallCardProps> = ({ stall, compact = false }) => {
  if (compact) {
    return (
      <div className="p-2 max-w-[250px]">
        <h3 className="font-bold text-lg text-green-800 dark:text-green-400">{stall.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{stall.location}</p>
        <div className="flex items-center mt-1">
          <Star className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-1" />
          <span className="text-sm font-medium dark:text-gray-300">{stall.rating}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-green-100 dark:border-gray-700 h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={stall.imageUrl} 
          alt={stall.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-full py-1 px-2 flex items-center">
          <Star className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-1" />
          <span className="text-sm font-medium dark:text-gray-300">{stall.rating}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-xl text-green-800 dark:text-green-400 mb-1">{stall.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-2 flex items-center">
          <span className="inline-block bg-green-100 dark:bg-green-900 rounded-full h-2 w-2 mr-2"></span>
          {stall.location}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">{stall.description}</p>
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-green-700 dark:text-green-500 mb-1 flex items-center">
            <Tea className="h-4 w-4 mr-1" /> 
            Specialties
          </h4>
          <div className="flex flex-wrap gap-1">
            {stall.specialties.map((specialty, index) => (
              <span 
                key={index} 
                className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full text-xs"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeaStallCard;