import mongoose from "mongoose";

const ilanSchema = mongoose.Schema({
  baslik: { type: String, required: true },
  kategori: { type: String, required: true },
  alt_kategori: { type: String, required: true },
  ilan_no: { type: Number, required: true },
  konum_il: { type: String, required: true },
  konum_ilce: { type: String, required: true },
  ilan_aciklama: { type: String, required: true },
  ucret: { type: String, required: true },
  ilan_tarihi: { type: String, required: true },
  ilan_bitis_Tarihi: { type: String, required: true },
  taksit_imkani: { type: String, required: true },
  egitmen_sayisi: { type: String, required: true },
  sertifika: { type: String, required: true },
  kurs_baslama_tarihi: { type: String, required: true },
  kurs_bitirme_tarihi: { type: String, required: true },
  olusturan: { type: String, required: true },
  olusturan_ad_soyad: { type: String, required: true },
  olusturan_tel: { type: String, required: true },
  olusturan_reg_date: { type: String, required: true },
  problemDescription: { type: String },
  isActive: { type: Boolean, default: true },
  images: [String],
});

const ilan = mongoose.model("ilanlar", ilanSchema);

export default ilan;
