const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Already connected to MongoDB");
        return;
    }

    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not defined");
        }

        const options = {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds
            bufferCommands: true, // Enable mongoose buffering for serverless
            bufferMaxEntries: 0 // Disable mongoose buffering
        };

        await mongoose.connect(process.env.MONGO_URI, options);
        
        isConnected = true;
        console.log("MongoDB Connected!");
        
        // Handle connection events
        mongoose.connection.on('disconnected', () => {
            isConnected = false;
            console.log('MongoDB disconnected');
        });
        
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        isConnected = false;
        throw error; // Let the calling function handle the error
    }
};

module.exports = connectDB;
