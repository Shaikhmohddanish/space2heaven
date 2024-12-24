import { connect, connection, ConnectionStates, disconnect } from "mongoose"

const MONGODB_URL = process.env.MONGODB_URL

if (!MONGODB_URL) throw new Error("Please add your MongoDB URL in .env file")

let isConnected = ConnectionStates.disconnected

export const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }
    try {
        const db = await connect(MONGODB_URL)
        isConnected = db.connections[0].readyState;
        console.log('Connected to MongoDB');
        // await PropertyModel.insertMany(properties)
        // console.log("Added Successfully!");
        
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        throw new Error('Failed to connect to MongoDB');
    }
}

export const disconnectDB = async () => {
    if (connection.readyState !== 0) {
      await disconnect();
      console.log("Database connection closed");
    }
  };