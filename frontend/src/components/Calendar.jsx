import React, { useState } from 'react';
import { allMockEntries } from '../data/mockData';

const Calendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEntryForDate = (year, month, day) => {
    const dateKey = formatDateKey(year, month, day);
    return allMockEntries.find(entry => entry.date === dateKey);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Create array of days
  const days = [];
  
  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ‹
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ›
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(dayName => (
          <div key={dayName} className="text-center text-xs font-medium text-gray-500 py-2">
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-10"></div>;
          }

          const entry = getEntryForDate(year, month, day);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <button
              key={day}
              onClick={() => onDateSelect && onDateSelect(new Date(year, month, day))}
              className={`
                h-10 flex items-center justify-center rounded-lg text-sm
                transition-all duration-200 relative
                ${isToday ? 'ring-2 ring-green-400' : ''}
                ${entry ? 'hover:scale-105' : 'hover:bg-gray-100'}
              `}
              style={{
                backgroundColor: entry ? entry.mood.color : 'transparent'
              }}
            >
              <span className={`${entry ? 'text-white font-medium' : 'text-gray-700'}`}>
                {day}
              </span>
              {entry && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;