import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ActivitySelector = ({ selectedActivities, onActivityToggle, activityCategories = [] }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  const isActivitySelected = (activity) => {
    return selectedActivities.some(a => a.id === activity.id);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Cosa hai fatto oggi?</h3>
        <p className="text-sm text-gray-500 mt-1">Seleziona le attività della giornata</p>
      </div>
      
      {activityCategories.map((category) => (
        <div key={category.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <h4 className="font-semibold text-gray-800">{category.name}</h4>
            {activeCategory === category.id ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {activeCategory === category.id && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-4 gap-3">
                {category.activities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => onActivityToggle(activity)}
                    className={`
                      p-4 rounded-2xl flex flex-col items-center gap-2
                      transition-all duration-300 transform
                      ${isActivitySelected(activity)
                        ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-700 scale-105 shadow-lg ring-2 ring-green-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-105 shadow-sm hover:shadow-md'
                      }
                    `}
                  >
                    <span className="text-2xl">{activity.icon}</span>
                    <span className="text-xs font-medium text-center leading-tight">
                      {activity.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Selected Activities Summary */}
      {selectedActivities.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-4 border border-green-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Selezionate ({selectedActivities.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedActivities.map((activity) => (
              <div
                key={activity.id}
                className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm"
              >
                <span>{activity.icon}</span>
                <span>{activity.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitySelector;