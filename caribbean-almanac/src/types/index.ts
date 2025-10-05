export interface Event {
  id: string;
  country_code: string;
  country_name: string;
  title: string;
  category: 'historical' | 'cultural';
  tags: string[];
  description: string;
  location: string;
  fixed_date: string | null; // MM-DD format
  rrule: string | null;
  relative_to: string | null;
  offset_days: number;
  sources: string[];
}

export interface ExpandedEvent extends Event {
  date: string; // YYYY-MM-DD format
  dateObject: Date;
}

export interface Country {
  code: string;
  name: string;
  flag?: string;
}

export interface EventFilters {
  category: 'all' | 'historical' | 'cultural';
  tags: string[];
  search: string;
}

export interface EventStore {
  selectedCountry: string;
  selectedYear: number;
  filters: EventFilters;
  expandedEvents: ExpandedEvent[];
  selectedDate: string | null;
  isDrawerOpen: boolean;
  setSelectedCountry: (country: string) => void;
  setSelectedYear: (year: number) => void;
  setFilters: (filters: Partial<EventFilters>) => void;
  setExpandedEvents: (events: ExpandedEvent[]) => void;
  setSelectedDate: (date: string | null) => void;
  setIsDrawerOpen: (open: boolean) => void;
}