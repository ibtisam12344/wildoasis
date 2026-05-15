// app/_lib/db.js
import mongoose from "mongoose";

// Cache the connection across hot-reloads in Next.js dev mode.
// Without this, every hot-reload creates a new connection attempt
// while the old mongoose instance is in a broken/transitional state.
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  // Already connected — reuse it
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Connection attempt already in progress — wait for it instead of
  // starting a second one (this is what caused the readyState crash:
  // two concurrent calls both tried to connect at the same time)
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        dbName: "wild_oasis",
        bufferCommands: false,
      })
      .then((m) => {
        console.log("✅ MongoDB Connected to 'wild_oasis' database");
        return m;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
        cached.promise = null; // Reset so next call retries
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
