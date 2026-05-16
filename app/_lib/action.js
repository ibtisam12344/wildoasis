"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { getBookings } from "./data-service";
import connectDB from "./db";
import Booking from "./models/Booking";
import Guest from "./models/Guest";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session?.user?.guestId) throw new Error("You must be logged in");

  await connectDB();

  const nationalID = formData.get("nationalID")?.trim();
  const nationalityRaw = formData.get("nationality");

  if (!nationalityRaw) throw new Error("Please select a country");

  const [nationality, countryFlag] = nationalityRaw.split("|||");

  if (!nationalID || !/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error(
      "Please provide a valid national ID (6–12 letters/numbers, no spaces or symbols)",
    );

  if (!nationality || !countryFlag)
    throw new Error("Invalid country selection, please try again");

  await Guest.findByIdAndUpdate(session.user.guestId, {
    nationality: nationality.trim(),
    countryFlag: countryFlag.trim(),
    nationalID,
  });

  revalidatePath("/account/profile");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session?.user?.guestId) throw new Error("You must be logged in");

  await connectDB();

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((b) => b._id.toString());

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  await Booking.findByIdAndDelete(bookingId);

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  const bookingId = formData.get("bookingId");

  await connectDB();

  await Booking.findByIdAndUpdate(bookingId, {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations")?.slice(0, 1000) || "",
  });

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  redirect("/account/reservations");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session?.user?.guestId) throw new Error("You must be logged in");

  await connectDB();

  const newBooking = {
    startDate: new Date(bookingData.startDate),
    endDate: new Date(bookingData.endDate),
    numNights: bookingData.numNights,
    numGuests: Number(formData.get("numGuests")),
    cabinPrice: bookingData.cabinPrice,
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    observations: (formData.get("observations") || "").slice(0, 1000),
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
    cabin: bookingData.cabinId,
    guest: session.user.guestId,
  };

  await Booking.create(newBooking);

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}
