import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ onDateSelect, entries = [] }) => {
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
    return entries.find(entry => entry.date === dateKey);
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
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

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
    <div className="p-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={() => navigateMonth(1)}
          className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(dayName => (
          <div key={dayName} className="text-center text-sm font-medium text-gray-500 py-3">
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-14"></div>;
          }

          const entry = getEntryForDate(year, month, day);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <button
              key={day}
              onClick={() => onDateSelect && onDateSelect(new Date(year, month, day))}
              className={`
                h-14 flex items-center justify-center rounded-2xl text-sm font-medium
                transition-all duration-300 relative
                ${isToday ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                ${entry ? 'hover:scale-105 shadow-lg' : 'hover:bg-gray-100'}
              `}
              style={{
                backgroundColor: entry ? entry.mood.color : 'transparent',
                color: entry ? 'white' : isToday ? '#1f2937' : '#6b7280',
                boxShadow: entry ? `0 8px 15px -3px ${entry.mood.color}40` : 'none'
              }}
            >
              <span className={entry ? 'font-bold' : ''}>{day}</span>
              {entry && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
          <span>Nessuna entry</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span>Con entry</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;