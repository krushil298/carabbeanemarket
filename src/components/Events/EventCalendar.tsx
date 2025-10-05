import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { MapPin, Clock, Users, ExternalLink } from 'lucide-react';
import { Event } from '../../types';
import { formatDate } from '../../utils/formatters';
import 'react-calendar/dist/Calendar.css';

interface EventCalendarProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events, onEventClick }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const eventsOnDate = events.filter(event => 
    event.date.toDateString() === selectedDate.toDateString()
  );

  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const getCategoryColor = (category: string) => {
    const colors = {
      market: 'bg-green-100 text-green-800',
      festival: 'bg-purple-100 text-purple-800',
      workshop: 'bg-blue-100 text-blue-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayEvents = events.filter(event => 
        event.date.toDateString() === date.toDateString()
      );
      
      if (dayEvents.length > 0) {
        return (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Caribbean Events
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-md transition-colors ${
              view === 'calendar'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-md transition-colors ${
              view === 'list'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              className="w-full border-none"
            />
          </div>

          {/* Events for Selected Date */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              Events on {formatDate(selectedDate)}
            </h3>
            {eventsOnDate.length > 0 ? (
              <div className="space-y-3">
                {eventsOnDate.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 dark:text-white">
                          {event.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin size={14} className="mr-1" />
                          {event.location}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No events on this date</p>
            )}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Upcoming Events
          </h3>
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => onEventClick?.(event)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {event.title}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {event.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users size={14} className="mr-1" />
                      {event.organizer}
                    </div>
                  </div>
                </div>
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-16 h-16 object-cover rounded-lg ml-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCalendar;