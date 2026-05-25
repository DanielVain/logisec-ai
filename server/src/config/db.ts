import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGO_URI;

        // Support both local (mongodb://) and Atlas cloud (mongodb+srv://) protocols
        if (
            !uri ||
            (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))
        ) {
            throw new Error(
                "MONGO_URI is completely missing or carries an unparseable protocol syntax format.",
            );
        }

        const conn = await mongoose.connect(uri);
        console.log(
            `[Database] MongoDB Cloud Atlas Cluster Connected: ${conn.connection.host}`,
        );
    } catch (error) {
        console.error(`[Database Error] Connection failed: ${error}`);
        process.exit(1);
    }
};
