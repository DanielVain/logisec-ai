import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error(
                "MONGO_URI is missing in your environment configuration.",
            );
        }

        const conn = await mongoose.connect(mongoURI);
        console.log(
            `[Database] MongoDB Securely Connected: ${conn.connection.host}`,
        );
    } catch (error) {
        console.error(`[Database Error] Connection failed: ${error}`);
        process.exit(1);
    }
};
