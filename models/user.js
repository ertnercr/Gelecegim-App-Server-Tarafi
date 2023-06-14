import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, trim: true },
  surname: { type: String, trim: true },
  email: { type: String, unique: true, trim: true },
  password: { type: String },
  regDate: { type: String},
  profileImage: {
    name: String,
    path: String,
  },
  defaultProfileImage: {
    type: String,
    default: "uploads/default-resim.png",
  },
  hesapTuru: { type: String },
  // friends: { type: Array, default: [] },
  business: { type: String },
  vdil: { type: String },
  vdad: { type: String },
  phone: { type: Number },
  il: { type: String },
  ilce: { type: String },
  vdil: { type: String },
  vdad: { type: String },
  verifytoken: {
    type: String,
  },
  vkNo: { type: Number },
  tcno: { type: Number },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  isVerified: { type: Boolean },
  Ilan: {
    type: Number, 
  },
});

const User = mongoose.model("User", userSchema);
export default User;
