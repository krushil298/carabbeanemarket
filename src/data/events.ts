import { Event } from '../types';

export const sampleEvents: Event[] = [
  {
    id: 'event-reggae-sumfest',
    title: 'Reggae Sumfest 2025',
    description: 'Jamaica\'s premier reggae festival featuring international and local artists. Four nights of non-stop reggae, dancehall, and Caribbean music.',
    date: new Date('2025-07-20'),
    location: 'Montego Bay, Jamaica',
    category: 'festival',
    organizer: 'Summerfest Productions',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'event-trinidad-carnival',
    title: 'Trinidad Carnival 2025',
    description: 'The greatest show on earth! Experience the vibrant culture, music, and costumes of Trinidad\'s world-famous Carnival celebration.',
    date: new Date('2025-03-03'),
    location: 'Port of Spain, Trinidad and Tobago',
    category: 'festival',
    organizer: 'National Carnival Commission',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'event-crop-over',
    title: 'Crop Over Festival 2025',
    description: 'Barbados\' most colorful festival celebrating the end of sugar cane harvest with calypso, soca, and traditional Bajan culture.',
    date: new Date('2025-08-04'),
    location: 'Bridgetown, Barbados',
    category: 'festival',
    organizer: 'Barbados Tourism Authority',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'event-junkanoo',
    title: 'Junkanoo Festival 2025',
    description: 'Nassau\'s spectacular street parade featuring elaborate costumes, Goombay music, and traditional Bahamian culture.',
    date: new Date('2025-01-01'),
    location: 'Nassau, Bahamas',
    category: 'festival',
    organizer: 'Bahamas Ministry of Tourism',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'event-jazz-fest',
    title: 'St. Lucia Jazz Festival 2025',
    description: 'World-class jazz artists perform against the backdrop of St. Lucia\'s stunning natural beauty.',
    date: new Date('2025-05-10'),
    location: 'Castries, Saint Lucia',
    category: 'festival',
    organizer: 'St. Lucia Tourism Authority',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'event-antigua-carnival',
    title: 'Antigua Carnival 2025',
    description: 'The Caribbean\'s most authentic carnival experience with traditional mas bands, calypso competitions, and street parties.',
    date: new Date('2025-08-01'),
    location: 'St. John\'s, Antigua and Barbuda',
    category: 'festival',
    organizer: 'Antigua Festivals Commission',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'event-kingston-market',
    title: 'Kingston Farmers Market',
    description: 'Weekly farmers market featuring local produce, crafts, and food vendors.',
    date: new Date('2025-01-18'),
    location: 'Kingston, Jamaica',
    category: 'market',
    organizer: 'Kingston Market Association',
    image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'event-craft-workshop',
    title: 'Caribbean Craft Workshop',
    description: 'Learn traditional Caribbean crafts including basket weaving, pottery, and wood carving.',
    date: new Date('2025-02-15'),
    location: 'Bridgetown, Barbados',
    category: 'workshop',
    organizer: 'Caribbean Arts Council',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

export const eventCategories = [
  { id: 'all', name: 'All Events', color: 'bg-gray-100 text-gray-800' },
  { id: 'festival', name: 'Festivals', color: 'bg-purple-100 text-purple-800' },
  { id: 'market', name: 'Markets', color: 'bg-green-100 text-green-800' },
  { id: 'workshop', name: 'Workshops', color: 'bg-blue-100 text-blue-800' },
  { id: 'other', name: 'Other', color: 'bg-gray-100 text-gray-800' }
];