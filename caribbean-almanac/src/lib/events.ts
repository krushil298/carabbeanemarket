import { format, parse, addDays, getYear, startOfYear, endOfYear } from 'date-fns';
import { RRule } from 'rrule';
import { Event, ExpandedEvent } from '@/types';
import eventsData from '../../data/events.json';

/**
 * Compute Easter Sunday for a given year using the algorithm
 */
function computeEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
}

/**
 * Compute Ash Wednesday for a given year (46 days before Easter)
 */
export function computeAshWednesday(year: number): Date {
  const easter = computeEaster(year);
  return addDays(easter, -46);
}

/**
 * Expand events for a specific country and year
 */
export function expandEventsForYear(countryCode: string, year: number): ExpandedEvent[] {
  const events = eventsData as Event[];
  const countryEvents = events.filter(event => event.country_code === countryCode);
  const expandedEvents: ExpandedEvent[] = [];

  for (const event of countryEvents) {
    if (event.fixed_date) {
      // Handle fixed date events (MM-DD format)
      const [month, day] = event.fixed_date.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const dateString = format(date, 'yyyy-MM-dd');
      
      expandedEvents.push({
        ...event,
        date: dateString,
        dateObject: date
      });
    } else if (event.rrule) {
      // Handle RRULE events
      try {
        const rule = RRule.fromString(event.rrule);
        const startDate = startOfYear(new Date(year, 0, 1));
        const endDate = endOfYear(new Date(year, 11, 31));
        
        const dates = rule.between(startDate, endDate, true);
        
        for (const date of dates) {
          const dateString = format(date, 'yyyy-MM-dd');
          expandedEvents.push({
            ...event,
            date: dateString,
            dateObject: date
          });
        }
      } catch (error) {
        console.error(`Error parsing RRULE for event ${event.id}:`, error);
      }
    } else if (event.relative_to && event.relative_to === 'ash_wednesday') {
      // Handle events relative to Ash Wednesday
      const ashWednesday = computeAshWednesday(year);
      const eventDate = addDays(ashWednesday, event.offset_days);
      const dateString = format(eventDate, 'yyyy-MM-dd');
      
      expandedEvents.push({
        ...event,
        date: dateString,
        dateObject: eventDate
      });
    }
  }

  return expandedEvents.sort((a, b) => a.dateObject.getTime() - b.dateObject.getTime());
}

/**
 * Get all available countries from events data
 */
export function getAvailableCountries(): { code: string; name: string }[] {
  const events = eventsData as Event[];
  const countries = new Map<string, string>();
  
  events.forEach(event => {
    countries.set(event.country_code, event.country_name);
  });
  
  return Array.from(countries.entries()).map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get events for a specific date
 */
export function getEventsForDate(events: ExpandedEvent[], date: string): ExpandedEvent[] {
  return events.filter(event => event.date === date);
}

/**
 * Filter events based on criteria
 */
export function filterEvents(events: ExpandedEvent[], filters: {
  category?: 'all' | 'historical' | 'cultural';
  tags?: string[];
  search?: string;
}): ExpandedEvent[] {
  let filtered = [...events];

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(event => event.category === filters.category);
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(event => 
      filters.tags!.some(tag => event.tags.includes(tag))
    );
  }

  if (filters.search && filters.search.trim()) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(event =>
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  return filtered;
}