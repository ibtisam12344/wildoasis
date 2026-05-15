// app/_lib/models/Booking.js
import mongoose from "mongoose";

const schema = new mongoose.Schema(
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

schema.index({ startDate: 1, endDate: 1 });
schema.index({ guest: 1 });

// Global cache
if (!globalThis.BookingModel) {
  globalThis.BookingModel =
    mongoose.models.Booking || mongoose.model("Booking", schema);
}

export default globalThis.BookingModel;
