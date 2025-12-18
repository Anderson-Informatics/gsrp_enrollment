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
}, { collection: 'gsrp_users' });

// GSRP User model
export default mongoose.model("User", schema);
