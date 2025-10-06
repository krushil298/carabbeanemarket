import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Users, CheckCircle, XCircle, AlertCircle, Filter } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import { getEvents, getUserRSVP, createOrUpdateRSVP } from '../services/eventService';
import { EventWithProfile, RSVPStatus } from '../types/database';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const EventsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<EventWithProfile[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [rsvpStates, setRsvpStates] = useState<Record<string, RSVPStatus>>({});

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, categoryFilter, countryFilter, selectedDate, view]);

  useEffect(() => {
    if (user?.id && events.length > 0) {
      fetchUserRSVPs();
    }
  }, [user, events]);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await getEvents({
        status: 'approved',
        limit: 100
      });

      if (fetchError) {
        throw fetchError;
      }

      setEvents(data);
      setFilteredEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRSVPs = async () => {
    if (!user?.id) return;

    const rsvps: Record<string, RSVPStatus> = {};

    for (const event of events) {
      try {
        const { data } = await getUserRSVP(event.id, user.id);
        if (data) {
          rsvps[event.id] = data.status;
        }
      } catch (err) {
        console.error('Error fetching RSVP:', err);
      }
    }

    setRsvpStates(rsvps);
  };

  const applyFilters = () => {
    let result = [...events];

    if (categoryFilter) {
      result = result.filter(event => event.category === categoryFilter);
    }

    if (countryFilter) {
      result = result.filter(event => event.country === countryFilter);
    }

    if (view === 'calendar') {
      result = result.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate.toDateString() === selectedDate.toDateString();
      });
    } else {
      result = result.filter(event => new Date(event.start_date) >= new Date());
    }

    setFilteredEvents(result);
  };

  const handleRSVP = async (eventId: string, status: RSVPStatus) => {
    if (!isAuthenticated || !user?.id) {
      alert('Please log in to RSVP');
      return;
    }

    try {
      const { error } = await createOrUpdateRSVP(eventId, user.id, status);

      if (error) {
        throw error;
      }

      setRsvpStates(prev => ({
        ...prev,
        [eventId]: status
      }));
    } catch (err) {
      console.error('Error updating RSVP:', err);
      alert('Failed to update RSVP. Please try again.');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      market: 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300',
      festival: 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300',
      workshop: 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-cyan-300',
      meetup: 'bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 text-orange-700 dark:text-orange-300',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  const tileContent = ({ date }: { date: Date }) => {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.start_date);
      return eventDate.toDateString() === date.toDateString();
    });

    if (dayEvents.length > 0) {
      return (
        <div className="flex justify-center mt-1">
          <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
        </div>
      );
    }
    return null;
  };

  const uniqueCategories = Array.from(new Set(events.map(e => e.category)));
  const uniqueCountries = Array.from(new Set(events.map(e => e.country)));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Caribbean Events
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover local markets, festivals, workshops, and community events across the Caribbean
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p>{error}</p>
              <button
                onClick={fetchEvents}
                className="text-sm underline mt-1 hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Filters</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg transition-all font-medium ${
                  view === 'list'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg transition-all font-medium ${
                  view === 'calendar'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Calendar View
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 transition-all"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 transition-all"
              >
                <option value="">All Locations</option>
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {view === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <Calendar
                onChange={(value) => setSelectedDate(value as Date)}
                value={selectedDate}
                tileContent={tileContent}
                className="w-full border-none rounded-lg"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <CalendarIcon size={20} className="text-cyan-600 dark:text-cyan-400" />
                {formatDate(selectedDate.toISOString())}
              </h3>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredEvents.length > 0 ? (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      rsvpStatus={rsvpStates[event.id]}
                      onRSVP={handleRSVP}
                      getCategoryColor={getCategoryColor}
                      compact
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No events on this date
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  rsvpStatus={rsvpStates[event.id]}
                  onRSVP={handleRSVP}
                  getCategoryColor={getCategoryColor}
                />
              ))
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  No upcoming events
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for new events in your area
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

interface EventCardProps {
  event: EventWithProfile;
  rsvpStatus?: RSVPStatus;
  onRSVP: (eventId: string, status: RSVPStatus) => void;
  getCategoryColor: (category: string) => string;
  compact?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, rsvpStatus, onRSVP, getCategoryColor, compact }) => {
  const [showDetails, setShowDetails] = useState(!compact);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
            {event.is_featured && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white">
                Featured
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {event.title}
          </h3>
        </div>
      </div>

      {showDetails && (
        <>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <Clock size={16} className="text-cyan-600 dark:text-cyan-400" />
              <span>{formatDate(event.start_date)}</span>
              {event.end_date && <span>- {formatDate(event.end_date)}</span>}
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <MapPin size={16} className="text-cyan-600 dark:text-cyan-400" />
              <span>{event.location}, {event.country}</span>
            </div>

            {event.max_attendees && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <Users size={16} className="text-cyan-600 dark:text-cyan-400" />
                <span>{event.attendee_count || 0} / {event.max_attendees} attendees</span>
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onRSVP(event.id, 'going')}
          className={`flex-1 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            rsvpStatus === 'going'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
          }`}
        >
          <CheckCircle size={18} />
          {rsvpStatus === 'going' ? 'Going' : 'RSVP'}
        </button>

        <button
          onClick={() => onRSVP(event.id, 'interested')}
          className={`flex-1 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            rsvpStatus === 'interested'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          }`}
        >
          <Users size={18} />
          {rsvpStatus === 'interested' ? 'Interested' : 'Maybe'}
        </button>

        {rsvpStatus && (
          <button
            onClick={() => onRSVP(event.id, 'not_going')}
            className="px-4 py-2.5 rounded-lg font-semibold transition-all bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <XCircle size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default EventsPage;