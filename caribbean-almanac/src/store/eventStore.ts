import { create } from 'zustand';
import { EventStore, EventFilters, ExpandedEvent } from '@/types';

export const useEventStore = create<EventStore>((set) => ({
  selectedCountry: 'BS', // Default to Bahamas
  selectedYear: new Date().getFullYear(),
  filters: {
    category: 'all',
    tags: [],
    search: ''
  },
  expandedEvents: [],
  selectedDate: null,
  isDrawerOpen: false,
  
  setSelectedCountry: (country: string) => set({ selectedCountry: country }),
  setSelectedYear: (year: number) => set({ selectedYear: year }),
  setFilters: (filters: Partial<EventFilters>) => 
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  setExpandedEvents: (events: ExpandedEvent[]) => set({ expandedEvents: events }),
  setSelectedDate: (date: string | null) => set({ selectedDate: date }),
  setIsDrawerOpen: (open: boolean) => set({ isDrawerOpen: open }),
}));