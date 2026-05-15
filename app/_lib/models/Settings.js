import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    minBookingLength: { type: Number, required: true },
    maxBookingLength: { type: Number, required: true },
    maxGuestsPerBooking: { type: Number, required: true },
    breakfastPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

const Settings =
  mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
export default Settings;
