import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  name: { type: String },
  surname: { type: String },
  email: { type: String, unique: true, trim: true },
  password: { type: String },
});

const admin = mongoose.model("admin", adminSchema);

export default admin;
