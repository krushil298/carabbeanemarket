import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import EventCalendar from '../components/Events/EventCalendar';
import { sampleEvents } from '../data/events';

const EventsPage: React.FC = () => {
  const [events] = useState(sampleEvents);

  const handleEventClick = (event: Event) => {
    console.log('Event clicked:', event);
    // Handle event click - could open modal or navigate to event detail page
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Caribbean Events
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover local markets, festivals, and workshops happening across the Caribbean
          </p>
        </div>

        <EventCalendar events={events} onEventClick={handleEventClick} />
      </div>
    </Layout>
  );
};

export default EventsPage;