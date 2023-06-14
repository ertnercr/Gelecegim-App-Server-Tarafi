import mongoose from "mongoose";

const ilceayriSchema = mongoose.Schema({
  id: { type: String },
  il_id:{type:String},
  name:{type:String}

});

const Ilceayri = mongoose.model("Ilcelerayri", ilceayriSchema);

export default Ilceayri;
