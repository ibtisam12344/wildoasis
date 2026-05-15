import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";

import { getCabin, getCabins } from "@/app/_lib/data-service";

import { Suspense } from "react";

// NOT DYNAMIC
// export const metadata = { title: "cabin" };

// DYNAMIC
export async function generateMetadata({ params }) {
  const { name } = await getCabin(params.cabinId);

  return { title: `Cabin ${name}` };
}

// to make page static so it can easily be deployed and no load on server we use this function and tell these are the cabinIds which will come so next js will make it static , if we dont tell it do not know the upcoming pages

export async function generateStaticParams() {
  const cabins = await getCabins();

  const ids = cabins.map((cabin) => ({ cabinId: cabin._id.toString() }));

  return ids;
}

// {params} is built in page we can acess to the params , the folder should be in [name] now it will be like {name:param}
export default async function Page({ params }) {
  // this approach  will take time and not good approach to fetch multiple data. Like first feetch takles 2 second , and similarly all one takes time and sum will be the total time

  const cabinDoc = await getCabin(params.cabinId);

  // Serialize the Mongoose document to a plain object so it can safely be
  // passed from this Server Component into Client Components (Cabin, Reservation,
  // ReservationForm). Mongoose documents have a toJSON method which Next.js
  // rejects when crossing the server→client boundary.
  const cabin = {
    _id: cabinDoc._id.toString(),
    id: cabinDoc._id.toString(),
    name: cabinDoc.name,
    maxCapacity: cabinDoc.maxCapacity,
    regularPrice: cabinDoc.regularPrice,
    discount: cabinDoc.discount,
    description: cabinDoc.description,
    image: cabinDoc.image,
  };

  return (
    <div className="mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
