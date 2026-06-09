import mongoose from "mongoose";

const connectDb = async () => {
    mongoose.connection.on("connected", () => {
        console.log("DB connected");
    });

    try {
        await mongoose.connect(
            `${process.env.MONGO_URL}/e-commerce`,
            {
                serverSelectionTimeoutMS: 10000,
            }
        );

        console.log("MongoDB connection established");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
    }
};

export default connectDb;