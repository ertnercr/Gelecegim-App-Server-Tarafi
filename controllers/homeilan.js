import dotenv from "dotenv";
dotenv.config();

import Ilan from "../models/ilan.js";

import Alan from "../models/kurumalani.js"
import altAlan from "../models/altalan.js";

//-------------------------------------------------------------------------------------------getIlans-----------------------------------------------------------------------------------------------

export const getIlans = async (req, res) => {
  try {
    const Ilans = await Ilan.find();

    res.status(200).json({ Ilans });
  } catch (error) {
    res.status(500).json({ message: "birşey yanlış gitti." });
  }
};

export const getKategoriliIlans=async (req,res)=>{
try{
  console.log("kategori çalıştı")
 
  const kategoriUrl=req.params.kategori;
  const altKategoriUrl=req.params.alt_kategori;
  

  
  let Ilans
  let Control
  if(altKategoriUrl){
    
    const turkce = altKategoriUrl.replace(/%20/g, " ");
    const decodedString=turkce.replace(/-/g, " ");
    Control=await altAlan.findOne({name:decodedString})
    Control=await Alan.findOne({id:Control.ana_id})

    if(Control.ad===kategoriUrl){
      Ilans=await Ilan.find({alt_kategori:decodedString})
      res.status(200).json({ Ilans });
    }

   else res.status(404).json({message:"Yanlış URL, kategori ve alt kategori uyuşmuyor."})
  }
  
  else{
    Ilans=await Ilan.find({kategori:kategoriUrl})
    res.status(200).json({ Ilans });
  }
  
  
  console.log("ilanlar:",Ilans)
} catch (error) {
  res.status(500).json({ message: "birşey yanlış gitti." });
  
}
}

