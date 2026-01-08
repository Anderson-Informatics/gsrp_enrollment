import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  name: String,
  email: String,
  createdAt: Date,
  password: String,
  confirmationToken: String,
  isConfirmed: {
    type: Boolean,
    default: false,
  },
}, { collection: 'gsrp_users' });

// GSRP User model
export default mongoose.model("User", schema);
