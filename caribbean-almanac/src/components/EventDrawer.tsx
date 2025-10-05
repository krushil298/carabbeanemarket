'use client';

import React, { useEffect } from 'react';
import { X, MapPin, ExternalLink, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ExpandedEvent } from '@/types';

interface EventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  events: ExpandedEvent[];
  selectedDate: string | null;
}

const EventDrawer: React.FC<EventDrawerProps> = ({ isOpen, onClose, events, selectedDate }) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus trap
      const drawer = document.getElementById('event-drawer');
      if (drawer) {
        const focusableElements = drawer.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        if (firstElement) {
          firstElement.focus();
        }
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !selectedDate) return null;

  const dateEvents = events.filter(event => event.date === selectedDate);
  const formattedDate = format(new Date(selectedDate), 'EEEE, MMMM d, yyyy');

  const getCategoryColor = (category: string) => {
    return category === 'historical' 
      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        id="event-drawer"
        className={`
          fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-gray-800 shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <div>
            <h2 id="drawer-title" className="text-xl font-semibold text-gray-900 dark:text-white">
              Events
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              {formattedDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close events panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {dateEvents.length > 0 ? (
            <div className="space-y-6">
              {dateEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    
                    {event.tags.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1">
                        <Tag className="w-4 h-4 text-gray-400 mr-1" />
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {event.sources.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs text-gray-500 mb-1">Sources:</p>
                        {event.sources.map((source, index) => (
                          <a
                            key={index}
                            href={source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Source {index + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No events found for this date
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventDrawer;