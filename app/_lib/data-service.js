// app/_lib/data-service.js
import connectDB from "./db.js";
import defineModels from "./models/index.js";
import { eachDayOfInterval } from "date-fns";
import { notFound } from "next/navigation";

export async function getCabins() {
  await connectDB();
  const models = defineModels();
  const cabins = await models.Cabin.find().sort({ name: 1 });

  return cabins;
}

export async function getCabin(id) {
  await connectDB();
  const models = defineModels();
  const cabin = await models.Cabin.findById(id);
  if (!cabin) notFound();
  return cabin;
}

export async function getCabinPrice(id) {
  await connectDB();
  const models = defineModels();
  const cabin = await models.Cabin.findById(id).select("regularPrice discount");
  if (!cabin) notFound();
  return cabin;
}

export async function getGuest(email) {
  await connectDB();
  const models = defineModels();
  return await models.Guest.findOne({ email: email.toLowerCase() });
}

export async function createGuest({ email, fullName }) {
  await connectDB();
  const models = defineModels();
  return await models.Guest.create({ email: email.toLowerCase(), fullName });
}

export async function getBooking(id) {
  await connectDB();
  const models = defineModels();
  const booking = await models.Booking.findById(id)
    .populate("cabin", "name image maxCapacity")
    .populate("guest", "fullName email");
  if (!booking) throw new Error("Booking could not be loaded");
  return booking;
}
export async function getBookings(guestId) {
  await connectDB();
  const models = defineModels();
  return await models.Booking.find({ guest: guestId })
    .populate("cabin", "name image")
    .sort({ createdAt: -1 });
}

export async function getBookedDatesByCabinId(cabinId) {
  await connectDB();
  const models = defineModels();
  const bookings = await models.Booking.find({ cabin: cabinId }).select(
    "startDate endDate",
  );

  return bookings.flatMap((booking) =>
    eachDayOfInterval({
      start: new Date(booking.startDate),
      end: new Date(booking.endDate),
    }),
  );
}

export async function getSettings() {
  await connectDB();
  const models = defineModels();
  const settings = await models.Settings.findOne();
  if (!settings) throw new Error("Settings could not be loaded");
  return settings;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag",
    );
    return await res.json();
  } catch {
    throw new Error("Could not fetch countries");
  }
}
