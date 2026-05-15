// app/_lib/models/index.js
import mongoose from "mongoose";

let models = {};

// Define all schemas
const defineModels = () => {
  if (Object.keys(models).length > 0) return models;

  // Guest Model
  const guestSchema = new mongoose.Schema(
    {
      fullName: { type: String, required: true },
      email: { type: String, required: true, unique: true, lowercase: true },
      nationalID: String,
      nationality: String,
      countryFlag: String,
    },
    { timestamps: true },
  );

  // Cabin Model
  const cabinSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      maxCapacity: { type: Number, required: true },
      regularPrice: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      description: String,
      image: String,
    },
    { timestamps: true },
  );

  // Booking Model
  const bookingSchema = new mongoose.Schema(
    {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      numNights: { type: Number, required: true },
      numGuests: { type: Number, required: true },
      cabinPrice: { type: Number, required: true },
      extrasPrice: { type: Number, default: 0 },
      totalPrice: { type: Number, required: true },
      status: {
        type: String,
        enum: ["unconfirmed", "checked-in", "checked-out"],
        default: "unconfirmed",
      },
      hasBreakfast: { type: Boolean, default: false },
      isPaid: { type: Boolean, default: false },
      observations: String,
      cabin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cabin",
        required: true,
      },
      guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guest",
        required: true,
      },
    },
    { timestamps: true },
  );

  bookingSchema.index({ startDate: 1, endDate: 1 });
  bookingSchema.index({ guest: 1 });

  // Settings Model
  const settingsSchema = new mongoose.Schema(
    {
      minBookingLength: { type: Number, required: true },
      maxBookingLength: { type: Number, required: true },
      maxGuestsPerBooking: { type: Number, required: true },
      breakfastPrice: { type: Number, required: true },
    },
    { timestamps: true },
  );

  models.Guest = mongoose.models.Guest || mongoose.model("Guest", guestSchema);
  models.Cabin = mongoose.models.Cabin || mongoose.model("Cabin", cabinSchema);
  models.Booking =
    mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
  models.Settings =
    mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

  return models;
};

export default defineModels;
