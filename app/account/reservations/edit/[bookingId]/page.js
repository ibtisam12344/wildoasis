import SubmitButton from "@/app/_components/SubmitButton";
import { updateBooking } from "@/app/_lib/action";
import { getBooking } from "@/app/_lib/data-service";
import connectDB from "@/app/_lib/db";
import defineModels from "@/app/_lib/models/index";

export default async function Page({ params }) {
  const { bookingId } = params;

  // getBooking populates cabin as an object — we read everything we need
  // directly from the booking doc instead of making a second getCabin() call
  // with an undefined cabinId.
  const bookingDoc = await getBooking(bookingId);

  const numGuests = bookingDoc.numGuests;
  const observations = bookingDoc.observations ?? "";

  // cabin is populated: { _id, name, image }
  const cabinId = bookingDoc.cabin._id.toString();
  const maxCapacity = bookingDoc.cabin.maxCapacity;

  // populate only returns the fields we asked for ("name image") — maxCapacity
  // wasn't included. Fetch it separately now that we have the real ObjectId.
  await connectDB();
  const models = defineModels();
  const cabinDoc = await models.Cabin.findById(cabinId).select("maxCapacity");
  const capacity = cabinDoc?.maxCapacity ?? 10;

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>

      <form
        action={updateBooking}
        className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
      >
        <input type="hidden" value={bookingId} name="bookingId" />

        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            defaultValue={numGuests}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: capacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            defaultValue={observations}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <SubmitButton pendingLabel="Updating...">
            Update reservation
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
