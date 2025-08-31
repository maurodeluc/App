import React from 'react';

const MoodSelector = ({ selectedMood, onMoodSelect, moodLevels = [], size = 'large' }) => {
  const sizeClasses = {
    small: 'w-10 h-10 text-lg',
    medium: 'w-14 h-14 text-2xl',
    large: 'w-18 h-18 text-3xl'
  };

  return (
    <div className="flex justify-center gap-4">
      {moodLevels.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onMoodSelect(mood)}
          className={`
            ${sizeClasses[size]}
            rounded-3xl flex items-center justify-center
            transition-all duration-300 transform relative
            ${selectedMood?.id === mood.id 
              ? 'scale-110 shadow-2xl ring-4 ring-white' 
              : 'hover:scale-105 shadow-lg hover:shadow-xl'
            }
          `}
          style={{ 
            backgroundColor: mood.color,
            boxShadow: selectedMood?.id === mood.id 
              ? `0 20px 25px -5px ${mood.color}40, 0 10px 10px -5px ${mood.color}30`
              : `0 10px 15px -3px ${mood.color}20, 0 4px 6px -2px ${mood.color}10`
          }}
        >
          <span className="filter drop-shadow-sm">{mood.emoji}</span>
          {selectedMood?.id === mood.id && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full font-medium capitalize whitespace-nowrap">
                {mood.name}
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;