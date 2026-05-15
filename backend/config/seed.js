const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Property = require('../models/Property');

const properties = [
  {
    title: 'Luxury 2-Bedroom Suite - Downtown Toronto',
    shortDescription: 'Fully furnished 2-bedroom suite in the heart of downtown Toronto with stunning city views.',
    description: `Welcome to this beautifully appointed 2-bedroom furnished suite located in the vibrant heart of downtown Toronto. This stunning unit offers everything you need for a comfortable and luxurious short-term stay.

The open-concept living and dining area is bright and modern, featuring high-end furniture, a 65" Smart TV, and floor-to-ceiling windows with breathtaking city views. The fully equipped kitchen comes with all appliances, cookware, and everything you need to prepare meals at home.

Both bedrooms feature plush queen-sized beds with premium linens, ample closet space, and blackout curtains for a perfect night's sleep. The elegant bathroom includes a rainfall shower and luxury toiletries.

Located steps from the CN Tower, Harbourfront, world-class restaurants, shopping, and entertainment — this property is perfect for business travelers, relocating professionals, or families looking for a home away from home.`,
    propertyType: 'Suite',
    status: 'available',
    featured: true,
    address: {
      street: '20 Blue Jays Way',
      city: 'Toronto',
      province: 'Ontario',
      postalCode: 'M5V 0E1',
      country: 'Canada',
      coordinates: { lat: 43.6426, lng: -79.3871 }
    },
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    squareFeet: 950,
    parkingSpots: 1,
    pricing: {
      perMonth: 4500,
      perWeek: 1200,
      perNight: 220,
      securityDeposit: 1500,
      cleaningFee: 150,
      currency: 'CAD'
    },
    minimumStay: 30,
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', caption: 'Living Room', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200', caption: 'Master Bedroom' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200', caption: 'Kitchen' },
      { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200', caption: 'Bathroom' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200', caption: 'City View' }
    ],
    amenities: [
      { name: 'WiFi', icon: 'wifi' },
      { name: 'Air Conditioning', icon: 'wind' },
      { name: 'Heating', icon: 'thermometer' },
      { name: 'Fully Equipped Kitchen', icon: 'utensils' },
      { name: 'Washer & Dryer', icon: 'shirt' },
      { name: 'Smart TV', icon: 'tv' },
      { name: 'Parking', icon: 'car' },
      { name: 'Gym Access', icon: 'dumbbell' },
      { name: 'Concierge', icon: 'bell' },
      { name: 'Elevator', icon: 'arrow-up' },
      { name: 'Balcony', icon: 'home' },
      { name: 'Pet Friendly', icon: 'heart' }
    ],
    tags: ['downtown', 'luxury', 'city view', 'business travel', 'toronto'],
    reviews: [
      { name: 'Sarah M.', rating: 5, comment: 'Absolutely gorgeous suite! Everything was spotless and the view was amazing. Will definitely book again.', date: new Date('2024-10-15') },
      { name: 'James T.', rating: 5, comment: 'Perfect for my 2-month work assignment. The kitchen had everything I needed and the location is unbeatable.', date: new Date('2024-11-20') },
      { name: 'Priya K.', rating: 4, comment: 'Beautiful apartment, very clean and well-furnished. Great communication from the host team.', date: new Date('2024-12-05') }
    ]
  },
  {
    title: 'Modern 1-Bedroom Apartment - Mississauga City Centre',
    shortDescription: 'Stylish 1-bedroom furnished apartment near Square One Mall with easy highway access.',
    description: `This chic and modern 1-bedroom apartment is perfectly located in Mississauga City Centre, just minutes from Square One Shopping Centre, top restaurants, and major highways (401, 403, QEW).

The apartment features a contemporary open layout with a sleek kitchen equipped with stainless steel appliances, granite countertops, and all the essentials. The spacious bedroom offers a comfortable queen bed with premium bedding. The living area includes a cozy sofa, work desk, and a large Smart TV perfect for relaxing after a long day.

Ideal for single professionals, couples, or anyone needing a comfortable furnished home in the Greater Toronto Area. Fast WiFi, in-suite laundry, and underground parking included.`,
    propertyType: 'Apartment',
    status: 'available',
    featured: true,
    address: {
      street: '4080 Living Arts Dr',
      city: 'Mississauga',
      province: 'Ontario',
      postalCode: 'L5B 4M4',
      country: 'Canada',
      coordinates: { lat: 43.5890, lng: -79.6441 }
    },
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    squareFeet: 650,
    parkingSpots: 1,
    pricing: {
      perMonth: 2800,
      perWeek: 800,
      perNight: 160,
      securityDeposit: 1000,
      cleaningFee: 100,
      currency: 'CAD'
    },
    minimumStay: 30,
    images: [
      { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200', caption: 'Living Area', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200', caption: 'Bedroom' },
      { url: 'https://images.unsplash.com/photo-1556909172-8c2f041fca1e?w=1200', caption: 'Kitchen' },
      { url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200', caption: 'Bathroom' }
    ],
    amenities: [
      { name: 'WiFi', icon: 'wifi' },
      { name: 'Air Conditioning', icon: 'wind' },
      { name: 'Heating', icon: 'thermometer' },
      { name: 'Fully Equipped Kitchen', icon: 'utensils' },
      { name: 'Washer & Dryer', icon: 'shirt' },
      { name: 'Smart TV', icon: 'tv' },
      { name: 'Underground Parking', icon: 'car' },
      { name: 'Gym Access', icon: 'dumbbell' },
      { name: 'Work Desk', icon: 'monitor' }
    ],
    tags: ['mississauga', 'square one', 'modern', '1-bedroom', 'gta'],
    reviews: [
      { name: 'Ahmed R.', rating: 5, comment: 'Exactly as described. Clean, modern, and very comfortable. The location near Square One is perfect.', date: new Date('2024-09-10') },
      { name: 'Lisa W.', rating: 4, comment: 'Great value for money. The apartment is well-furnished and the building amenities are excellent.', date: new Date('2024-11-01') }
    ]
  },
  {
    title: 'Spacious 3-Bedroom Family Home - Brampton',
    shortDescription: 'Large fully furnished 3-bedroom house perfect for families or groups in quiet Brampton neighbourhood.',
    description: `This beautiful and spacious 3-bedroom fully furnished home in Brampton offers the perfect retreat for families or groups needing more space. Located in a quiet, safe residential neighbourhood with easy access to Brampton Civic Hospital, Sheridan College, and major highways.

The home features a large living room, separate dining area, and a fully equipped kitchen with all appliances. Three well-appointed bedrooms sleep up to 6 guests comfortably. The backyard provides a private outdoor space for relaxation.

With a 2-car driveway, high-speed internet, and all utilities included, this home is truly move-in ready. Perfect for medical professionals, corporate relocations, or families in transition.`,
    propertyType: 'House',
    status: 'available',
    featured: false,
    address: {
      street: '45 Howden Blvd',
      city: 'Brampton',
      province: 'Ontario',
      postalCode: 'L6S 2Z3',
      country: 'Canada',
      coordinates: { lat: 43.7315, lng: -79.7624 }
    },
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    squareFeet: 1400,
    parkingSpots: 2,
    pricing: {
      perMonth: 3800,
      perWeek: 1050,
      perNight: 200,
      securityDeposit: 1500,
      cleaningFee: 180,
      currency: 'CAD'
    },
    minimumStay: 30,
    images: [
      { url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200', caption: 'House Exterior', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200', caption: 'Living Room' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200', caption: 'Kitchen' },
      { url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200', caption: 'Master Bedroom' },
      { url: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=1200', caption: 'Backyard' }
    ],
    amenities: [
      { name: 'WiFi', icon: 'wifi' },
      { name: 'Air Conditioning', icon: 'wind' },
      { name: 'Heating', icon: 'thermometer' },
      { name: 'Fully Equipped Kitchen', icon: 'utensils' },
      { name: 'Washer & Dryer', icon: 'shirt' },
      { name: 'Smart TV', icon: 'tv' },
      { name: 'Driveway Parking (2 cars)', icon: 'car' },
      { name: 'Backyard', icon: 'tree' },
      { name: 'BBQ Grill', icon: 'flame' },
      { name: 'All Utilities Included', icon: 'zap' }
    ],
    tags: ['brampton', 'family', 'house', '3-bedroom', 'spacious', 'backyard'],
    reviews: [
      { name: 'Mohammed A.', rating: 5, comment: 'Perfect family home! Spacious, clean, and had everything we needed for our 2-month stay. Highly recommend!', date: new Date('2024-08-20') }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'A1 Furnished Admin',
      email: process.env.ADMIN_EMAIL || 'admin@a1suites.ca',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'superadmin'
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Create properties
    for (const prop of properties) {
      await Property.create(prop);
    }
    console.log(`✅ ${properties.length} properties seeded`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('-----------------------------------');
    console.log(`Admin Email: ${process.env.ADMIN_EMAIL || 'admin@a1suites.ca'}`);
    console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('-----------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
