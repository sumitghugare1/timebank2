require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected for admin creation");

    // Admin credentials - CHANGE THESE!
    const adminEmail = "admin@timebank.com";
    const adminPassword = "admin123";
    const adminName = "System Administrator";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword} (assuming it hasn't been changed)`);
      
      // Update admin privileges just in case
      if (!existingAdmin.isAdmin) {
        await User.findByIdAndUpdate(existingAdmin._id, { isAdmin: true });
        console.log("Updated user to have admin privileges.");
      }
      
      mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create new admin user
    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
      timeCredits: 1000
    });

    await admin.save();
    console.log("Admin user created successfully!");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

createAdmin();
