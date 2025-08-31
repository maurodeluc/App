import React from 'react';
import { moodLevels } from '../data/mockData';

const MoodSelector = ({ selectedMood, onMoodSelect, size = 'large' }) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-lg',
    medium: 'w-12 h-12 text-2xl',
    large: 'w-16 h-16 text-3xl'
  };

  return (
    <div className="flex justify-center gap-3">
      {moodLevels.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onMoodSelect(mood)}
          className={`
            ${sizeClasses[size]}
            rounded-full flex items-center justify-center
            transition-all duration-200 transform
            ${selectedMood?.id === mood.id 
              ? 'scale-110 ring-4 ring-white ring-opacity-50 shadow-lg' 
              : 'hover:scale-105 shadow-md'
            }
          `}
          style={{ backgroundColor: mood.color }}
        >
          <span className="filter drop-shadow-sm">{mood.emoji}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;