import mongoose from "mongoose";

const VdilSchema = mongoose.Schema({
  id: { type: String },
  province_code:{ type: Number },
  ad: { type: String },
  district_id:{type:String}
});

const vdIl = mongoose.model("vergidaireleri", VdilSchema);



export default vdIl;