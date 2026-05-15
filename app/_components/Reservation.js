import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";

import { auth } from "../_lib/auth";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import LoginMessage from "./LoginMessage";

async function Reservation({ cabin }) {
  const [settingsDoc, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);

  // Serialize Mongoose document to plain object for Client Component
  const settings = {
    minBookingLength: settingsDoc.minBookingLength,
    maxBookingLength: settingsDoc.maxBookingLength,
    maxGuestsPerBooking: settingsDoc.maxGuestsPerBooking,
    breakfastPrice: settingsDoc.breakfastPrice,
  };

  const session = await auth();

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />

      {session?.user ? (
        <ReservationForm user={session.user} cabin={cabin} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}

export default Reservation;
