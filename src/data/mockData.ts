import { User, Product, Message } from '../types';

// Caribbean Islands/Countries
export const caribbeanLocations = [
  'Antigua and Barbuda',
  'Bahamas',
  'Barbados',
  'Belize',
  'Cuba',
  'Dominica',
  'Dominican Republic',
  'Grenada',
  'Guyana',
  'Haiti',
  'Jamaica',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Suriname',
  'Trinidad and Tobago',
  'Aruba',
  'Curaçao',
  'Sint Maarten',
  'British Virgin Islands',
  'Cayman Islands',
  'Turks and Caicos',
  'Anguilla',
  'Montserrat',
  'Guadeloupe',
  'Martinique',
  'Puerto Rico',
  'US Virgin Islands'
];

// Car Makes (Updated 2024 including Japanese brands)
export const carMakes = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Buick', 'Cadillac',
  'Chevrolet', 'Chrysler', 'Citroën', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 'Genesis',
  'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini',
  'Land Rover', 'Lexus', 'Lincoln', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz',
  'MINI', 'Mitsubishi', 'Nissan', 'Peugeot', 'Porsche', 'Ram', 'Rolls-Royce',
  'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo', 'Daihatsu'
];

// Car Models by Make (Expanded with Japanese models)
export const carModels: { [key: string]: string[] } = {
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Tacoma', 'Tundra', 'Sienna', 'Avalon', 'C-HR', 'Land Cruiser', 'Yaris', 'Vitz', 'Crown', 'Mark X'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Fit', 'HR-V', 'Passport', 'Ridgeline', 'Insight', 'City', 'Jazz', 'Vezel', 'Freed', 'Stream'],
  'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Murano', 'Maxima', 'Frontier', 'Titan', 'Versa', '370Z', 'March', 'Note', 'Juke', 'X-Trail', 'Skyline'],
  'Mazda': ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5 Miata', 'CX-3', 'CX-30', 'Mazda2', 'Demio', 'Atenza', 'Axela', 'Premacy', 'Biante'],
  'Mitsubishi': ['Outlander', 'Eclipse Cross', 'Mirage', 'Lancer', 'Pajero', 'Delica', 'Galant', 'Colt', 'ASX', 'Montero'],
  'Subaru': ['Outback', 'Forester', 'Impreza', 'Legacy', 'Crosstrek', 'WRX', 'Ascent', 'BRZ', 'Levorg', 'Exiga'],
  'Suzuki': ['Swift', 'Vitara', 'Jimny', 'Baleno', 'S-Cross', 'Alto', 'Wagon R', 'Hustler', 'Spacia', 'Every'],
  'Isuzu': ['D-Max', 'MU-X', 'Trooper', 'Rodeo', 'Elf', 'Forward', 'Giga'],
  'Daihatsu': ['Terios', 'Sirion', 'Copen', 'Move', 'Tanto', 'Mira', 'Cast', 'Wake'],
  'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape', 'Focus', 'Fusion', 'Edge', 'Expedition', 'Ranger', 'Bronco'],
  'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Suburban', 'Traverse', 'Camaro', 'Corvette', 'Cruze', 'Impala'],
  'BMW': ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X7', 'Z4', 'i3', 'i8', 'M3'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLS', 'A-Class', 'CLA', 'SL', 'AMG GT'],
  'Audi': ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8']
};

// Car Years (2000-2025)
export const carYears = Array.from({ length: 26 }, (_, i) => 2025 - i);

// Car Parts Categories
export const carPartsCategories = [
  'Engine',
  'Transmission',
  'Brakes',
  'Suspension',
  'Electrical',
  'Body Parts',
  'Interior',
  'Exhaust',
  'Cooling System',
  'Fuel System',
  'Computer/ECU',
  'Wheels & Tires',
  'Lights',
  'Mirrors',
  'Bumpers',
  'Doors',
  'Windows',
  'Seats',
  'Dashboard',
  'Steering'
];

// Service Categories
export const serviceCategories = [
  'Gardening & Landscaping',
  'House Cleaning',
  'Car Wash & Detailing',
  'Plumbing',
  'Electrical Work',
  'Painting',
  'Carpentry',
  'Appliance Repair',
  'Computer Repair',
  'Tutoring',
  'Pet Care',
  'Catering',
  'Photography',
  'Event Planning',
  'Moving Services'
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john@example.com',
    username: 'john_doe',
    profilePicture: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    bio: 'Car enthusiast from Jamaica',
    location: 'Jamaica',
    phone: '+1-876-555-0123',
    joinedDate: new Date('2023-01-15'),
    emailVerified: true,
    phoneVerified: true,
    islandVerified: true
  },
  {
    id: 'user-2',
    email: 'sarah@example.com',
    username: 'sarah_wilson',
    profilePicture: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    bio: 'Real estate agent in Barbados',
    location: 'Barbados',
    phone: '+1-246-555-0456',
    joinedDate: new Date('2023-02-20'),
    emailVerified: true,
    phoneVerified: true,
    islandVerified: true
  },
  {
    id: 'user-3',
    email: 'mike@example.com',
    username: 'mike_tech',
    profilePicture: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    bio: 'Tech enthusiast from Trinidad',
    location: 'Trinidad and Tobago',
    phone: '+1-868-555-0789',
    joinedDate: new Date('2023-03-10'),
    emailVerified: true,
    phoneVerified: false,
    islandVerified: false
  }
];

// Helper function to create mock seller data for display purposes
export const getMockSellerData = (userId: string) => {
  const mockUser = mockUsers.find(user => user.id === userId);
  if (mockUser) {
    return {
      id: mockUser.id,
      name: mockUser.username || `User ${userId.slice(-4)}`,
      username: mockUser.username || `User ${userId.slice(-4)}`,
      profilePicture: mockUser.profilePicture,
      rating: 4.8,
      totalRatings: 25,
      ratings: 4.8,
      isVerified: mockUser.emailVerified && mockUser.phoneVerified,
      phoneVerified: mockUser.phoneVerified,
      emailVerified: mockUser.emailVerified,
      islandVerified: mockUser.islandVerified,
      joinedDate: mockUser.joinedDate
    };
  }
  
  return {
    id: userId,
    name: `User ${userId.slice(-4)}`,
    username: `User ${userId.slice(-4)}`,
    profilePicture: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    totalRatings: 25,
    ratings: 4.8,
    isVerified: true,
    phoneVerified: true,
    emailVerified: true,
    islandVerified: true,
    joinedDate: new Date('2023-01-15')
  };
};

// Updated Categories
export const categories = [
  'Cars',
  'Real Estate',
  'Jobs',
  'Electronics',
  'Furniture',
  'Fashion',
  'Phones',
  'Services',
  'Home & Garden',
  'Food & Dining',
  'Pets',
  'Sports & Recreation',
  'Arts & Crafts',
  'Toys & Games',
  'Musical Instruments',
  'Events',
  'Lost & Found',
  'Free Items',
  'Miscellaneous'
];

// Mock Products with trending and local gems data
export const mockProducts: Product[] = [
  {
    id: 'product-1',
    userId: 'user-1',
    title: '2020 Toyota Camry - Excellent Condition',
    description: 'Well-maintained Toyota Camry with low mileage. Perfect for daily commuting. Features include automatic transmission, air conditioning, power steering, and excellent fuel economy.',
    price: 25000,
    currency: 'USD',
    category: 'Automotive - Cars',
    images: [
      'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    condition: 'good',
    location: 'Jamaica',
    createdAt: new Date('2023-05-10'),
    favorites: 24,
    sold: false,
    inventory: 1,
    tags: ['reliable', 'fuel-efficient', 'automatic'],
    views: 156,
    trending: true,
    localGem: true,
    // Car specific fields
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 45000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    negotiable: true,
    negotiablePrice: 23000,
    salesCount: 0
  },
  {
    id: 'product-2',
    userId: 'user-2',
    title: 'Luxury Beachfront Villa - For Sale',
    description: 'Stunning 4-bedroom beachfront villa with panoramic ocean views. Features include infinity pool, private beach access, modern kitchen, and spacious living areas.',
    price: 850000,
    currency: 'USD',
    category: 'Real Estate - Sale',
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    condition: 'newly-constructed',
    location: 'Barbados',
    createdAt: new Date('2023-04-20'),
    favorites: 18,
    sold: false,
    inventory: 1,
    tags: ['luxury', 'beachfront', 'villa'],
    views: 89,
    trending: true,
    localGem: true,
    propertyType: 'Villa',
    bedrooms: 4,
    bathrooms: 3.5,
    squareFeet: 3200,
    amenities: ['Private Beach', 'Infinity Pool', 'Ocean View', 'Modern Kitchen'],
    salesCount: 0
  },
  {
    id: 'product-3',
    userId: 'user-3',
    title: 'Gaming Laptop - High Performance',
    description: 'High-end gaming laptop perfect for gaming and professional work. Features latest graphics card, fast processor, and excellent display quality.',
    price: 1200,
    currency: 'USD',
    category: 'Computers',
    images: [
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    condition: 'like-new',
    location: 'Trinidad and Tobago',
    createdAt: new Date('2023-06-01'),
    favorites: 12,
    sold: true,
    soldAt: new Date('2023-06-15'),
    inventory: 1,
    tags: ['gaming', 'laptop', 'high-performance'],
    views: 67,
    trending: false,
    localGem: false,
    salesCount: 1
  },
  {
    id: 'product-4',
    userId: 'user-1',
    title: 'Honda Civic Engine Parts - 2018',
    description: 'Original Honda Civic engine parts in excellent condition. Perfect for repairs or upgrades.',
    price: 800,
    currency: 'USD',
    category: 'Automotive - Parts',
    images: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    condition: 'good',
    location: 'Jamaica',
    createdAt: new Date('2023-05-25'),
    favorites: 8,
    sold: false,
    inventory: 1,
    tags: ['honda', 'engine', 'parts'],
    views: 34,
    trending: false,
    localGem: true,
    // Car parts specific fields
    partName: 'Engine Block',
    partCategory: 'Engine',
    compatibleMake: 'Honda',
    compatibleModel: 'Civic',
    compatibleYear: 2018,
    salesCount: 0
  },
  {
    id: 'product-5',
    userId: 'user-2',
    title: 'Handcrafted Caribbean Jewelry Set',
    description: 'Beautiful handmade jewelry featuring traditional Caribbean designs with coral and turquoise stones.',
    price: 150,
    currency: 'USD',
    category: 'Jewelry',
    images: [
      'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    condition: 'new',
    location: 'Barbados',
    createdAt: new Date('2023-06-10'),
    favorites: 15,
    sold: false,
    inventory: 5,
    tags: ['handmade', 'caribbean', 'jewelry', 'coral'],
    views: 78,
    trending: true,
    localGem: true,
    salesCount: 3
  }
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: 'message-1',
    senderId: 'user-2',
    receiverId: 'user-1',
    content: 'Hi, is the Toyota Camry still available? I\'m interested in viewing it.',
    timestamp: new Date('2023-06-01T14:30:00'),
    read: true,
    productId: 'product-1',
    messageType: 'text'
  },
  {
    id: 'message-2',
    senderId: 'user-1',
    receiverId: 'user-2',
    content: 'Yes, it is still available! Would you like to schedule a viewing?',
    timestamp: new Date('2023-06-01T15:45:00'),
    read: true,
    productId: 'product-1',
    messageType: 'text'
  },
  {
    id: 'message-3',
    senderId: 'user-3',
    receiverId: 'user-1',
    content: 'I\'d like to make an offer of $22,000 for the Camry. Is that acceptable?',
    timestamp: new Date('2023-06-02T10:30:00'),
    read: false,
    productId: 'product-1',
    messageType: 'offer',
    offerAmount: 22000
  }
];

// Property Types
export const propertyTypes = [
  'House',
  'Apartment',
  'Condo',
  'Villa',
  'Townhouse',
  'Land',
  'Commercial',
  'Multi-family',
  'Beach House',
  'Cottage'
];