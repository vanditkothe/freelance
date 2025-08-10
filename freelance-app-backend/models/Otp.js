import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  userData: {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String, enum: ["client", "freelancer"] }, 
  },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // expires in 5 mins
});

export default mongoose.model("Otp", otpSchema);
