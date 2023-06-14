import mongoose from "mongoose";

const altAlanSchema = mongoose.Schema({
    id: { type: Number },
    name:{ type: String },
    ana_id:{type:String},
  });
  
  const altAlan = mongoose.model("alt_alan", altAlanSchema);
  
  
  
  export default altAlan;