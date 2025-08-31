import React from 'react';

const EntryCard = ({ entry, onClick, compact = false }) => {
  const formatDate = (dateString) => {
    try {
      // Validate date format first
      if (!dateString || dateString === 'invalid-date-format' || dateString === 'Invalid Date') {
        return 'Data non valida';
      }
      
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Data non valida';
      }
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Oggi';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Ieri';
      } else {
        return date.toLocaleDateString('it-IT', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      console.warn('Error formatting date:', dateString, error);
      return 'Data non valida';
    }
  };

  if (compact) {
    return (
      <button
        onClick={() => onClick && onClick(entry)}
        className="w-full p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all text-left hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-sm"
              style={{ backgroundColor: entry.mood.color }}
            >
              {entry.mood.emoji}
            </div>
            <div>
              <span className="text-sm font-medium text-gray-800">
                {formatDate(entry.date)}
              </span>
              <div className="flex gap-1 mt-1">
                {entry.activities.slice(0, 3).map((activity, index) => (
                  <span key={activity.id} className="text-xs">
                    {activity.icon}
                  </span>
                ))}
                {entry.activities.length > 3 && (
                  <span className="text-xs text-gray-400">+{entry.activities.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick && onClick(entry)}
      className="w-full bg-gradient-to-r from-gray-50 to-white rounded-3xl p-6 hover:shadow-lg transition-all duration-300 text-left border border-gray-100 hover:border-gray-200"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">
          {formatDate(entry.date)}
        </span>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg"
          style={{ 
            backgroundColor: entry.mood.color,
            boxShadow: `0 8px 15px -3px ${entry.mood.color}30`
          }}
        >
          {entry.mood.emoji}
        </div>
      </div>

      {entry.activities.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {entry.activities.slice(0, 6).map((activity, index) => (
              <div
                key={activity.id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm border border-gray-100"
              >
                <span>{activity.icon}</span>
                <span>{activity.name}</span>
              </div>
            ))}
            {entry.activities.length > 6 && (
              <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                +{entry.activities.length - 6} altro
              </div>
            )}
          </div>
        </div>
      )}

      {entry.note && (
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {entry.note}
        </p>
      )}
    </button>
  );
};

export default EntryCard;