import mongoose from "mongoose";

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

const Guest = mongoose.models.Guest || mongoose.model("Guest", guestSchema);
export default Guest;
