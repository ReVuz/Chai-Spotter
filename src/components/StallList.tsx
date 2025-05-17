import React from 'react';
import { TeaStall } from '../types';
import TeaStallCard from './TeaStallCard';

interface StallListProps {
  stalls: TeaStall[];
  selectedStall: TeaStall | null;
  setSelectedStall: (stall: TeaStall | null) => void;
}

const StallList: React.FC<StallListProps> = ({ stalls, selectedStall, setSelectedStall }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {stalls.map((stall) => (
        <div 
          key={stall.id} 
          onClick={() => setSelectedStall(stall)}
          className={`cursor-pointer transform transition-transform duration-300 ${
            selectedStall?.id === stall.id 
              ? 'scale-[1.02] ring-2 ring-green-600 dark:ring-green-400 ring-offset-2 dark:ring-offset-gray-900 rounded-lg' 
              : 'hover:scale-[1.01]'
          }`}
        >
          <TeaStallCard stall={stall} />
        </div>
      ))}
    </div>
  );
};

export default StallList;