import React, { useState } from 'react';
import { activityCategories } from '../data/mockData';

const ActivitySelector = ({ selectedActivities, onActivityToggle }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  const isActivitySelected = (activity) => {
    return selectedActivities.some(a => a.id === activity.id);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Cosa hai fatto oggi?</h3>
      
      {activityCategories.map((category) => (
        <div key={category.id} className="bg-white rounded-xl p-4 shadow-sm">
          <button
            onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            className="w-full flex justify-between items-center text-left"
          >
            <h4 className="font-medium text-gray-800">{category.name}</h4>
            <span className={`transform transition-transform ${
              activeCategory === category.id ? 'rotate-180' : ''
            }`}>
              ⌄
            </span>
          </button>
          
          {activeCategory === category.id && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {category.activities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => onActivityToggle(activity)}
                  className={`
                    p-3 rounded-lg flex flex-col items-center gap-1
                    transition-all duration-200 transform
                    ${isActivitySelected(activity)
                      ? 'bg-green-100 text-green-700 scale-105 shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-105'
                    }
                  `}
                >
                  <span className="text-xl">{activity.icon}</span>
                  <span className="text-xs font-medium text-center leading-tight">
                    {activity.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ActivitySelector;