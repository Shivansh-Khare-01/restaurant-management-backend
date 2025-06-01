const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const DB_URL = 'mongodb+srv://shivanshkhare999:Cuvette3737@cluster0.teqgwop.mongodb.net/restaurant-management?retryWrites=true&w=majority&appName=Cluster0';

const chefSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  order_taken: {
    type: Number,
    default: 0,
    min: 0
  },
}, {
  timestamps: false,
});

const Chef = mongoose.model('Chef', chefSchema);

// Chef data - 4 chefs with order_taken = 0
const chefData = [
  {
    name: "Manesh",
    order_taken: 0
  },
  {
    name: "Pritam",
    order_taken: 0
  },
  {
    name: "Yash",
    order_taken: 0
  },
  {
    name: "Tenzen",
    order_taken: 0
  }
];

// Function to connect to MongoDB and seed chef data
async function seedChefData() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully!');

    // Clear existing chefs
    console.log('🗑️  Clearing existing chefs...');
    await Chef.deleteMany({});
    console.log('✅ Existing chefs cleared!');

    // Insert new chefs
    console.log('👨‍🍳 Inserting new chefs...');
    const insertedChefs = await Chef.insertMany(chefData);
    console.log(`✅ Successfully inserted ${insertedChefs.length} chefs!`);

    // Display chef details
    console.log('\n👨‍🍳 Chef Details:');
    console.log('================');
    insertedChefs.forEach((chef, index) => {
      console.log(`${index + 1}. ID: ${chef._id}`);
      console.log(`   Name: ${chef.name}`);
      console.log(`   Orders Taken: ${chef.order_taken}`);
      console.log(`   Status: ${chef.isActive ? 'Active' : 'Inactive'}`);
      console.log('   ---');
    });

    // Display summary
    console.log('\n📊 Summary:');
    const totalChefs = await Chef.countDocuments();
    const activeChefs = await Chef.countDocuments({ isActive: true });
    console.log(`   Total Chefs: ${totalChefs}`);
    console.log(`   Active Chefs: ${activeChefs}`);
    console.log(`   Total Orders Taken: ${insertedChefs.reduce((sum, chef) => sum + chef.order_taken, 0)}`);

    console.log('\n🎉 Chef data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding chef data:', error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
}

// Run the seeding function
if (require.main === module) {
  seedChefData();
}

module.exports = { seedChefData, chefData };
