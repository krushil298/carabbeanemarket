'use client';

import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ExpandedEvent } from '@/types';
import { getEventsForDate } from '@/lib/events';

interface CalendarGridProps {
  year: number;
  events: ExpandedEvent[];
  onDateClick: (date: string) => void;
  selectedDate: string | null;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ year, events, onDateClick, selectedDate }) => {
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

  const renderMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Get first day of week (0 = Sunday)
    const firstDayOfWeek = monthStart.getDay();
    const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

    return (
      <div key={format(monthDate, 'yyyy-MM')} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          {format(monthDate, 'MMMM yyyy')}
        </h3>
        
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="h-8" />
          ))}
          
          {/* Month days */}
          {days.map((day) => {
            const dateString = format(day, 'yyyy-MM-dd');
            const dayEvents = getEventsForDate(events, dateString);
            const hasEvents = dayEvents.length > 0;
            const isSelected = selectedDate === dateString;
            const isCurrentDay = isToday(day);
            
            return (
              <button
                key={dateString}
                onClick={() => hasEvents && onDateClick(dateString)}
                className={`
                  h-8 w-8 text-sm rounded-md relative transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${hasEvents ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20' : 'cursor-default'}
                  ${isSelected ? 'bg-blue-600 text-white' : ''}
                  ${isCurrentDay && !isSelected ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' : ''}
                  ${!isSelected && !isCurrentDay ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                `}
                disabled={!hasEvents}
                aria-label={`${format(day, 'MMMM d, yyyy')}${hasEvents ? ` - ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''}`}
              >
                {format(day, 'd')}
                
                {/* Event indicators */}
                {hasEvents && (
                  <div className="absolute -top-1 -right-1">
                    {dayEvents.length === 1 ? (
                      <div className={`w-2 h-2 rounded-full ${
                        dayEvents[0].category === 'historical' ? 'bg-red-500' : 'bg-green-500'
                      }`} />
                    ) : (
                      <div className="bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {dayEvents.length}
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {months.map(renderMonth)}
    </div>
  );
};

export default CalendarGrid;