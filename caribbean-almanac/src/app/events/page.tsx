'use client';

import React, { useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CountrySelect from '@/components/CountrySelect';
import YearPicker from '@/components/YearPicker';
import CalendarGrid from '@/components/CalendarGrid';
import EventDrawer from '@/components/EventDrawer';
import Filters from '@/components/Filters';
import Legend from '@/components/Legend';
import { useEventStore } from '@/store/eventStore';
import { expandEventsForYear, filterEvents } from '@/lib/events';

const EventsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    selectedCountry,
    selectedYear,
    filters,
    expandedEvents,
    selectedDate,
    isDrawerOpen,
    setSelectedCountry,
    setSelectedYear,
    setFilters,
    setExpandedEvents,
    setSelectedDate,
    setIsDrawerOpen
  } = useEventStore();

  // Initialize from URL params
  useEffect(() => {
    const countryParam = searchParams.get('country');
    const yearParam = searchParams.get('year');
    const dateParam = searchParams.get('date');

    if (countryParam) setSelectedCountry(countryParam);
    if (yearParam) setSelectedYear(parseInt(yearParam));
    if (dateParam) {
      setSelectedDate(dateParam);
      setIsDrawerOpen(true);
    }
  }, [searchParams, setSelectedCountry, setSelectedYear, setSelectedDate, setIsDrawerOpen]);

  // Expand events when country or year changes
  useEffect(() => {
    const events = expandEventsForYear(selectedCountry, selectedYear);
    setExpandedEvents(events);
  }, [selectedCountry, selectedYear, setExpandedEvents]);

  // Update URL when selections change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('country', selectedCountry);
    params.set('year', selectedYear.toString());
    if (selectedDate) params.set('date', selectedDate);
    
    router.replace(`/events?${params.toString()}`, { scroll: false });
  }, [selectedCountry, selectedYear, selectedDate, router]);

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return filterEvents(expandedEvents, filters);
  }, [expandedEvents, filters]);

  // Get available tags from current events
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    expandedEvents.forEach(event => {
      event.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [expandedEvents]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Caribbean Almanac
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discover cultural and historical events across the Caribbean
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <CountrySelect
                selectedCountry={selectedCountry}
                onCountryChange={setSelectedCountry}
              />
              <YearPicker
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Filters
              filters={filters}
              onFiltersChange={setFilters}
              availableTags={availableTags}
            />
            <Legend />
          </div>

          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {selectedYear} Calendar - {expandedEvents.find(e => e.country_code === selectedCountry)?.country_name || 'Caribbean'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredEvents.length} events found
              </p>
            </div>
            
            <CalendarGrid
              year={selectedYear}
              events={filteredEvents}
              onDateClick={handleDateClick}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>

      {/* Event Drawer */}
      <EventDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        events={filteredEvents}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default EventsPage;