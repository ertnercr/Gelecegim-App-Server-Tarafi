import mongoose from "mongoose";

const ilSchema = mongoose.Schema({
  ad: { type: String },
  plaka: { type: Number },
  ilceler: [{ type: String }],
});

const Il = mongoose.model("Il", ilSchema);

export default Il;
