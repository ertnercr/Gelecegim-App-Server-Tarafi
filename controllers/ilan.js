import alan from "../models/kurumalani.js";
import altAlan from "../models/altalan.js";
import ilan from "../models/ilan.js";
import User from "../models/user.js";
import cloudinary from "cloudinary";
import fs from "fs";
export const ilanKaydet = async (req, res) => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_KEY_SECRET,
  });

  function formatDate(date) {
    const yil = date.getUTCFullYear();
    const ay = date.getUTCMonth();
    const gun = date.getUTCDate();
    const tarih = `${gun}/${ay + 1}/${yil}`;
    return tarih;
  }
  function addDays(date, days) {
    const dateCopy = new Date(date);
    dateCopy.setDate(date.getDate() + days);
    return dateCopy;
  }
  try {
    const {
      secilen,
      baslik,
      brans,
      aciklama,
      ucret,
      taksit,
      egitmenSayisi,
      sertifika,
      kursBaslama,
      kursBitis,
      il,
      ilce,
      ilanSure,
    } = req.body;

    const images = req.files.map((file) => `ilanresim/${file.filename}`);
    console.log("images:", images);
    const resimler = [];
    for (const image of images) {
      const imageUrl = await cloudinary.uploader.upload(image);
      fs.unlink(image, (error) => {
        if (error) {
          res.status(500).json({ error: "Silinecek Dosya Bulunamadı." });
        }
      });

      resimler.push(imageUrl.secure_url);
    }
    const user = await User.findById(req.user.id);

    if (user) {
      user.Ilan = user.Ilan + 1;

      await user.save();

      //-------------------- İlan ve İlan Bitiş Tarihi Ayarları----------------//
      const now = new Date();
      const ilanTarihi = formatDate(now);
      const BitisTarihi = formatDate(addDays(now, ilanSure));

      /*    console.log(BitisTarihi);
      console.log(ilanTarihi); */
      //-------------------- İlan no atama işlemi ----------------//
      let ilan_controller;
      let new_number;
      do {
        new_number = Math.floor(Math.random() * 100000000);
        ilan_controller = ilan.findOne({ ilan_no: new_number });
      } while (!ilan_controller);
      //-------------------- İlan ve İlan Bitiş Tarihi Ayarları----------------//

      const newIlan = new ilan({
        baslik,
        kategori: secilen,
        alt_kategori: brans,
        ilan_no: new_number,
        konum_il: il,
        konum_ilce: ilce,
        ilan_aciklama: aciklama,
        ucret,
        ilan_tarihi: ilanTarihi,
        ilan_bitis_Tarihi: BitisTarihi,
        taksit_imkani: taksit,
        egitmen_sayisi: egitmenSayisi,
        sertifika,
        kurs_baslama_tarihi: kursBaslama,
        kurs_bitirme_tarihi: kursBitis,
        olusturan: user._id,
        olusturan_ad_soyad: `${user.name} ${user.surname}`,
        olusturan_tel: user.phone,
        olusturan_reg_date: user.regDate,
        images: resimler,
      });
      await newIlan.save();
      const savedIlan = await ilan.findOne({ ilan_no: new_number });
      res.status(200).json(newIlan);
    } else {
      throw new Error("Invalid user");
    }
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
};



export const getSingleIlan = async (req, res) => {
  const { ilan_no, ilan_baslik } = req.params;

  // Convert the URL parameter back to its original format
  const formattedBaslik = ilan_baslik.replace(/-/g, " ");
  const singleIlan = await ilan.findOne({
    ilan_no: ilan_no,
    baslik: formattedBaslik,
  });

  if (!singleIlan) {
    return res.status(404).json({ error: "İlan bulunamadı" });
  }

  res.status(200).json(singleIlan);
};

export const getAltAlan = async (req, res) => {
  try {
    const { ad } = req.params;
    const seciliAlan = await alan.findOne({ ad: ad });
    const alan_id = seciliAlan.id.toString();

    const alt_alanlar = await altAlan.find({ ana_id: alan_id });

    res.status(200).json(alt_alanlar);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
