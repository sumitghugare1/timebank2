const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log("Already connected to MongoDB");
        return;
    }

    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not defined");
        }

        // Disconnect any existing connections
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }

        const options = {
            maxPoolSize: 3, // Reduce pool size for serverless
            serverSelectionTimeoutMS: 15000, // Increase timeout
            socketTimeoutMS: 45000,
            bufferCommands: false, // Disable buffering for faster failures
            bufferMaxEntries: 0,
            connectTimeoutMS: 15000,
            family: 4 // Use IPv4
        };

        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, options);
        
        isConnected = true;
        console.log("MongoDB Connected successfully!");
        
        // Handle connection events
        mongoose.connection.on('disconnected', () => {
            isConnected = false;
            console.log('MongoDB disconnected');
        });
        
        mongoose.connection.on('error', (err) => {
            isConnected = false;
            console.error('MongoDB connection error:', err);
        });
        
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        isConnected = false;
        throw error;
    }
};

module.exports = connectDB;
