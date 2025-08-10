import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true,  trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["client", "freelancer"], required: true },
  savedGigs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Gig" }],
});

export default mongoose.model('User', userSchema);
