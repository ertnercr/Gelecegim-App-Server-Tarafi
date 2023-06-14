import mongoose from "mongoose";

const kurumAlanSchema = mongoose.Schema({
    id: { type: String },
    ad:{ type: String },
    
  });
  
  const alan = mongoose.model("kurum_alanlari", kurumAlanSchema);
  
  
  
  export default alan;