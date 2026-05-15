import ReservationList from "@/app/_components/ReservationList";
import { auth } from "@/app/_lib/auth";
import { getBookings } from "@/app/_lib/data-service";

export const metadata = {
  title: "Reservations",
};

export default async function Page() {
  const session = await auth();
  const bookingDocs = await getBookings(session?.user?.guestId);

  // Serialize Mongoose documents to plain objects before passing to
  // the Client Component (ReservationList). Mongoose docs have toJSON/toObject
  // methods that cause Next.js RSC serialization to recurse infinitely.
  const bookings = bookingDocs.map((b) => ({
    id: b._id.toString(),
    _id: b._id.toString(),
    startDate: b.startDate.toISOString(),
    endDate: b.endDate.toISOString(),
    numNights: b.numNights,
    numGuests: b.numGuests,
    cabinPrice: b.cabinPrice,
    extrasPrice: b.extrasPrice,
    totalPrice: b.totalPrice,
    status: b.status,
    hasBreakfast: b.hasBreakfast,
    isPaid: b.isPaid,
    observations: b.observations || "",
    created_at: b.createdAt
      ? b.createdAt.toISOString()
      : new Date().toISOString(),
    guestId: b.guest?._id?.toString() ?? b.guest?.toString() ?? null,
    // ReservationCard destructures booking.cabins.{ name, image }
    // Our MongoDB populate puts it under booking.cabin — remap to match:
    cabins: {
      name: b.cabin?.name ?? "",
      image: b.cabin?.image ?? "",
    },
  }));

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <a className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </a>
        </p>
      ) : (
        <ReservationList bookings={bookings} />
      )}
    </div>
  );
}
