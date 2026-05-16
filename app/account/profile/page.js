import SelectCountry from "@/app/_components/SelectCountry";
import UpdateprofileForm from "@/app/_components/UpdateprofileForm";

import { auth } from "@/app/_lib/auth";
import { getGuest } from "@/app/_lib/data-service";

export const metadata = {
  title: "Update profile",
};

export default async function Page() {
  const session = await auth();
  const rawGuest = await getGuest(session?.user?.email);

  if (!rawGuest) {
    return (
      <div className="text-primary-200">
        Could not load profile. Please try signing out and back in.
      </div>
    );
  }

  const guest = {
    _id: rawGuest._id.toString(),
    fullName: rawGuest.fullName ?? "",
    email: rawGuest.email ?? "",
    nationality: rawGuest.nationality ?? "",
    nationalID: rawGuest.nationalID ?? "",
    countryFlag: rawGuest.countryFlag ?? "",
  };

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Update your guest profile
      </h2>
      <p className="text-lg mb-8 text-primary-200">
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>
      <UpdateprofileForm guest={guest}>
        <SelectCountry
          name="nationality"
          id="nationality"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          defaultCountry={guest.nationality}
        />
      </UpdateprofileForm>
    </div>
  );
}
