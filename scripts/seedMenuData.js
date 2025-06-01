const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const DB_URL = 'mongodb+srv://shivanshkhare999:Cuvette3737@cluster0.teqgwop.mongodb.net/restaurant-management?retryWrites=true&w=majority&appName=Cluster0';

// Menu Item Schema (matching your model)
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['pizza', 'burger', 'drinks', 'veggies', 'french-fries']
  },
  image: {
    type: String,
    default: 'default-food.jpg'
  },
  preparation_time: {
    type: Number, // in minutes
    default: 15
  },
}, {
  timestamps: false,
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Dummy menu data - 6 vegetarian items for each category (Prices in Indian Rupees ₹)
const menuData = [
  // Pizza Category (6 items - All Vegetarian)
  {
    name: "Margherita Pizza",
    description: "Classic pizza with fresh tomatoes, mozzarella cheese, and basil",
    price: 299,
    category: "pizza",
    image: "margherita-pizza.jpg",
    preparation_time: 20
  },
  {
    name: "Paneer Tikka Pizza",
    description: "Pizza with spiced paneer, bell peppers, onions, and mint chutney",
    price: 449,
    category: "pizza",
    image: "paneer-tikka-pizza.jpg",
    preparation_time: 25
  },
  {
    name: "Vegetarian Supreme",
    description: "Loaded with bell peppers, mushrooms, olives, onions, and tomatoes",
    price: 379,
    category: "pizza",
    image: "vegetarian-pizza.jpg",
    preparation_time: 23
  },
  {
    name: "Corn & Cheese Pizza",
    description: "Pizza with sweet corn, extra cheese, and herbs",
    price: 349,
    category: "pizza",
    image: "corn-cheese-pizza.jpg",
    preparation_time: 20
  },
  {
    name: "Mushroom & Spinach Pizza",
    description: "Pizza with fresh mushrooms, spinach, and white sauce",
    price: 399,
    category: "pizza",
    image: "mushroom-spinach-pizza.jpg",
    preparation_time: 22
  },
  {
    name: "Cheese Burst Pizza",
    description: "Pizza with extra cheese filling in the crust and mixed vegetables",
    price: 499,
    category: "pizza",
    image: "cheese-burst-pizza.jpg",
    preparation_time: 28
  },

  // Burger Category (6 items - All Vegetarian)
  {
    name: "Aloo Tikki Burger",
    description: "Spiced potato patty with mint chutney, onions, and tomatoes",
    price: 179,
    category: "burger",
    image: "aloo-tikki-burger.jpg",
    preparation_time: 15
  },
  {
    name: "Paneer Burger",
    description: "Grilled paneer patty with lettuce, tomato, and tandoori sauce",
    price: 229,
    category: "burger",
    image: "paneer-burger.jpg",
    preparation_time: 14
  },
  {
    name: "Veggie Deluxe Burger",
    description: "Mixed vegetable patty with cheese, lettuce, and special sauce",
    price: 199,
    category: "burger",
    image: "veggie-deluxe-burger.jpg",
    preparation_time: 10
  },
  {
    name: "Mushroom Swiss Burger",
    description: "Vegetarian patty with sautéed mushrooms and cheese",
    price: 219,
    category: "burger",
    image: "mushroom-swiss-burger.jpg",
    preparation_time: 13
  },
  {
    name: "Cheese Corn Burger",
    description: "Crispy corn and cheese patty with mayo and vegetables",
    price: 189,
    category: "burger",
    image: "cheese-corn-burger.jpg",
    preparation_time: 12
  },
  {
    name: "Rajma Burger",
    description: "Spiced kidney bean patty with onions and green chutney",
    price: 209,
    category: "burger",
    image: "rajma-burger.jpg",
    preparation_time: 16
  },

  // Drinks Category (6 items - All Vegetarian)
  {
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 89,
    category: "drinks",
    image: "orange-juice.jpg",
    preparation_time: 3
  },
  {
    name: "Masala Chai",
    description: "Traditional Indian spiced tea with milk",
    price: 49,
    category: "drinks",
    image: "masala-chai.jpg",
    preparation_time: 5
  },
  {
    name: "Mango Lassi",
    description: "Creamy yogurt drink blended with fresh mango",
    price: 129,
    category: "drinks",
    image: "mango-lassi.jpg",
    preparation_time: 4
  },
  {
    name: "Fresh Lime Soda",
    description: "Refreshing lime juice with soda and mint",
    price: 69,
    category: "drinks",
    image: "lime-soda.jpg",
    preparation_time: 3
  },
  {
    name: "Chocolate Milkshake",
    description: "Rich chocolate milkshake topped with whipped cream",
    price: 149,
    category: "drinks",
    image: "chocolate-milkshake.jpg",
    preparation_time: 6
  },
  {
    name: "Filter Coffee",
    description: "South Indian style filter coffee",
    price: 59,
    category: "drinks",
    image: "filter-coffee.jpg",
    preparation_time: 4
  },

  // Veggies Category (6 items - All Vegetarian)
  {
    name: "Garden Fresh Salad",
    description: "Mixed greens with cucumber, tomatoes, and mint dressing",
    price: 159,
    category: "veggies",
    image: "garden-fresh-salad.jpg",
    preparation_time: 8
  },
  {
    name: "Grilled Vegetable Platter",
    description: "Assorted grilled vegetables with herb seasoning",
    price: 249,
    category: "veggies",
    image: "grilled-vegetables.jpg",
    preparation_time: 15
  },
  {
    name: "Paneer Tikka Salad",
    description: "Grilled paneer with fresh vegetables and yogurt dressing",
    price: 219,
    category: "veggies",
    image: "paneer-tikka-salad.jpg",
    preparation_time: 12
  },
  {
    name: "Roasted Broccoli",
    description: "Fresh broccoli roasted with garlic and herbs",
    price: 139,
    category: "veggies",
    image: "roasted-broccoli.jpg",
    preparation_time: 12
  },
  {
    name: "Corn & Spinach Salad",
    description: "Fresh spinach with sweet corn and lemon dressing",
    price: 179,
    category: "veggies",
    image: "corn-spinach-salad.jpg",
    preparation_time: 10
  },
  {
    name: "Stuffed Bell Peppers",
    description: "Bell peppers stuffed with rice and mixed vegetables",
    price: 199,
    category: "veggies",
    image: "stuffed-peppers.jpg",
    preparation_time: 18
  },

  // French Fries Category (6 items - All Vegetarian)
  {
    name: "Classic French Fries",
    description: "Golden crispy fries with sea salt",
    price: 99,
    category: "french-fries",
    image: "classic-fries.jpg",
    preparation_time: 8
  },
  {
    name: "Loaded Cheese Fries",
    description: "Fries topped with melted cheese and herbs",
    price: 149,
    category: "french-fries",
    image: "loaded-cheese-fries.jpg",
    preparation_time: 12
  },
  {
    name: "Sweet Potato Fries",
    description: "Crispy sweet potato fries with cinnamon sugar",
    price: 129,
    category: "french-fries",
    image: "sweet-potato-fries.jpg",
    preparation_time: 10
  },
  {
    name: "Garlic Parmesan Fries",
    description: "Fries tossed with garlic butter and parmesan cheese",
    price: 119,
    category: "french-fries",
    image: "garlic-parmesan-fries.jpg",
    preparation_time: 9
  },
  {
    name: "Masala Fries",
    description: "Spiced fries with Indian masala and mint chutney",
    price: 139,
    category: "french-fries",
    image: "masala-fries.jpg",
    preparation_time: 11
  },
  {
    name: "Peri Peri Fries",
    description: "Crispy fries with tangy peri peri seasoning",
    price: 129,
    category: "french-fries",
    image: "peri-peri-fries.jpg",
    preparation_time: 10
  }
];

// Function to connect to MongoDB and seed data
async function seedMenuData() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully!');

    // Clear existing menu items
    console.log('🗑️  Clearing existing menu items...');
    await MenuItem.deleteMany({});
    console.log('✅ Existing menu items cleared!');

    // Insert new menu items
    console.log('📝 Inserting new menu items...');
    const insertedItems = await MenuItem.insertMany(menuData);
    console.log(`✅ Successfully inserted ${insertedItems.length} menu items!`);

    // Display summary
    console.log('\n📊 Summary:');
    const categories = ['pizza', 'burger', 'drinks', 'veggies', 'french-fries'];
    for (const category of categories) {
      const count = await MenuItem.countDocuments({ category });
      console.log(`   ${category}: ${count} items`);
    }

    console.log('\n🎉 Menu data seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding menu data:', error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
}

// Run the seeding function
if (require.main === module) {
  seedMenuData();
}

module.exports = { seedMenuData, menuData };
