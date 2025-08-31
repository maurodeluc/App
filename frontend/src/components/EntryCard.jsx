import React from 'react';

const EntryCard = ({ entry, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <button
      onClick={() => onClick && onClick(entry)}
      className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600">
          {formatDate(entry.date)}
        </span>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
          style={{ backgroundColor: entry.mood.color }}
        >
          {entry.mood.emoji}
        </div>
      </div>

      {entry.activities.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {entry.activities.slice(0, 6).map((activity, index) => (
            <span
              key={activity.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs"
            >
              <span>{activity.icon}</span>
              <span className="text-gray-700">{activity.name}</span>
            </span>
          ))}
          {entry.activities.length > 6 && (
            <span className="text-xs text-gray-500">
              +{entry.activities.length - 6} more
            </span>
          )}
        </div>
      )}

      {entry.note && (
        <p className="text-sm text-gray-600 line-clamp-2">
          {entry.note}
        </p>
      )}
    </button>
  );
};

export default EntryCard;