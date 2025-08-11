import mongoose from 'mongoose';
import { User } from './models/user.model.js';
import { Product } from './models/product.model.js';
import { Order } from './models/order.model.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/justRentIt`);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const dummyProducts = [
  {
    productName: "Canon EOS R5 Camera",
    description: "Professional mirrorless camera with 45MP full-frame sensor, 8K video recording, and image stabilization. Perfect for photography and videography projects.",
    category: "Electronics",
    hourlyPrice: 250,
    dailyPrice: 800,
    productPrice: 800,
    images: ["https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=400&fit=crop"],
    availability: "In Stock",
    pickup: "Same day available"
  },
  {
    productName: "MacBook Pro 16-inch M3",
    description: "Latest MacBook Pro with M3 chip, 32GB RAM, 1TB SSD. Ideal for video editing, software development, and creative work.",
    category: "Electronics",
    hourlyPrice: 180,
    dailyPrice: 600,
    productPrice: 600,
    images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=400&fit=crop"],
    availability: "In Stock",
    pickup: "Same day available"
  },
  {
    productName: "Trek Mountain Bike",
    description: "High-performance mountain bike with 21-speed transmission, front suspension, and disc brakes. Great for trails and outdoor adventures.",
    category: "Sports",
    hourlyPrice: 50,
    dailyPrice: 150,
    productPrice: 150,
    images: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=400&fit=crop"],
    availability: "In Stock",
    pickup: "Same day available"
  },
  {
    productName: "Tesla Model 3",
    description: "Electric sedan with autopilot features, premium interior, and 350+ mile range. Perfect for city trips and weekend getaways.",
    category: "Vehicles",
    hourlyPrice: 300,
    dailyPrice: 1200,
    productPrice: 1200,
    images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&h=400&fit=crop"],
    availability: "Limited",
    pickup: "Next day available"
  },
  {
    productName: "Professional Photography Kit",
    description: "Complete photography setup with DSLR camera, multiple lenses, tripod, lighting equipment, and accessories.",
    category: "Electronics",
    hourlyPrice: 120,
    dailyPrice: 400,
    productPrice: 400,
    images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=400&fit=crop"],
    availability: "In Stock",
    pickup: "Same day available"
  },
  {
    productName: "Gaming Setup Complete",
    description: "High-end gaming PC with RTX 4080, mechanical keyboard, gaming mouse, and 27-inch 144Hz monitor.",
    category: "Electronics",
    hourlyPrice: 80,
    dailyPrice: 300,
    productPrice: 300,
    images: ["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=400&fit=crop"],
    availability: "In Stock",
    pickup: "Same day available"
  },
  {
    productName: "Professional Drone DJI Mavic",
    description: "4K drone with gimbal stabilization, 30-minute flight time, and obstacle avoidance. Perfect for aerial photography.",
    category: "Electronics",
    hourlyPrice: 100,
    dailyPrice: 350,
    productPrice: 350,
    images: ["https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=400&fit=crop"],
    availability: "In Stock",
    pickup: "Same day available"
  },
  {
    productName: "Camping Gear Set",
    description: "Complete camping setup with 4-person tent, sleeping bags, camping stove, lanterns, and outdoor cooking equipment.",
    category: "Sports",
    hourlyPrice: 30,
    dailyPrice: 100,
    productPrice: 100,
    images: ["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&h=400&fit=crop"],
    availability: "In Stock",
    pickup: "Same day available"
  },
  {
    productName: "Power Tools Kit",
    description: "Professional grade power tools including drill, saw, sanders, and various hand tools. Perfect for home improvement projects.",
    category: "Tools",
    hourlyPrice: 40,
    dailyPrice: 120,
    productPrice: 120,
    images: ["https://images.unsplash.com/photo-1581783898377-1dcbc9a4f113?w=500&h=400&fit=crop"],
    availability: "In Stock",
    pickup: "Same day available"
  },
  {
    productName: "Party Speaker System",
    description: "Professional sound system with wireless microphones, LED lights, and Bluetooth connectivity. Great for events and parties.",
    category: "Electronics",
    hourlyPrice: 60,
    dailyPrice: 200,
    productPrice: 200,
    images: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=400&fit=crop"],
    availability: "In Stock",
    pickup: "Same day available"
  },
  {
    productName: "Surfboard & Wetsuit",
    description: "Professional surfboard with wetsuit included. Perfect for beginners and experienced surfers. Board wax and leash included.",
    category: "Sports",
    hourlyPrice: 25,
    dailyPrice: 80,
    productPrice: 80,
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=400&fit=crop"],
    availability: "In Stock",
    pickup: "Same day available"
  },
  {
    productName: "Wedding Decoration Package",
    description: "Complete wedding decoration set with centerpieces, fairy lights, fabric draping, and floral arrangements.",
    category: "Home & Garden",
    hourlyPrice: 80,
    dailyPrice: 300,
    productPrice: 300,
    images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&h=400&fit=crop"],
    availability: "On Request",
    pickup: "2-3 days"
  }
];

const createDummyUser = async () => {
  const existingUser = await User.findOne({ email: 'dummy@example.com' });
  if (existingUser) {
    return existingUser;
  }

  const dummyUser = new User({
    name: 'Dummy User',
    email: 'dummy@example.com',
    password: 'password123',
    phone: '+91 9876543210',
    address: 'Mumbai, Maharashtra, India'
  });

  return await dummyUser.save();
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Create dummy user
    const dummyUser = await createDummyUser();
    console.log('Dummy user created/found:', dummyUser.name);

    // Clear existing products (optional)
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Create products with dummy user as owner
    const productsWithOwner = dummyProducts.map(product => ({
      ...product,
      owner: dummyUser._id,
      ownerName: dummyUser.name
    }));

    const createdProducts = await Product.insertMany(productsWithOwner);
    console.log(`Created ${createdProducts.length} dummy products`);

    console.log('Database seeded successfully!');
    console.log('Sample products:');
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.productName} - Rs ${product.dailyPrice}/day`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();