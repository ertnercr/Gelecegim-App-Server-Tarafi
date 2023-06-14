import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import Admin from "../models/admin.js";
import User from "../models/user.js";
import Ilan from "../models/ilan.js";
//-------------------------------------------------------------------------------------------LOGİN-----------------------------------------------------------------------------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin.isVerified === false)
      return res.status(400).json({ message: "mail onaylanmamış." });

    if (!existingAdmin)
      return res.status(400).json({ message: "Kullanıcı mevcut degil." });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "geçersiz şifre" });
    res.status(200).json({ existingAdmin });
  } catch (error) {
    res.status(500).json({ message: "birşey yanlış gitti." });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { hesapTuru, search } = req.query;
    let query = {};

    if (hesapTuru === "true" || hesapTuru === "false") {
      query.isVerified = hesapTuru === "true";
    } else if (hesapTuru) {
      query.hesapTuru = hesapTuru;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { surname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];

      const searchNumber = parseInt(search);
      if (!isNaN(searchNumber)) {
        query.$or.push(
          { vkNo: searchNumber },
          { phone: searchNumber },
          { tcno: searchNumber }
        );
      }
    }
    const users = await User.find(query);
    res.status(200).json({ users });
  } catch (error) {
    console.error("Kullanıcıları getirirken bir hata oluştu:", error);
    res
      .status(500)
      .json({ error: "Kullanıcıları getirme sırasında bir hata oluştu" });
  }
};

export const getIlans = async (req, res) => {
  try {
    const { isVerified, search } = req.query;

    let query = {};

    if (isVerified === "true" || isVerified === "false") {
      query.isVerified = isVerified === "true";
    }

    if (search) {
      query.$or = [
        { baslik: { $regex: search, $options: "i" } },
        { ilan_aciklama: { $regex: search, $options: "i" } },
      ];
    }

    const Ilans = await Ilan.find(query);

    res.status(200).json({ Ilans });
  } catch (error) {
    res.status(500).json({ message: "birşey yanlış gitti." });
  }
};
export const getUsersIlan = async (req, res) => {
  try {
    const { userId } = req.params;
    const Ilans = await Ilan.find({ olusturan: userId });
    const users = await User.find({ _id: userId });

    res.status(200).json({ Ilans, users });
  } catch (error) {
    res.status(500).json({ message: "birşey yanlış gitti." });
  }
};
export const DeleteUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
export const getEditUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    const Ilans = await Ilan.find({ olusturan: userId });

    res.status(200).json({ Ilans });
  } catch (error) {
    res.status(500).json({ message: "birşey yanlış gitti." });
  }
};
export const DeleteIlans = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete the Ilan from the database
    await Ilan.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getEditIlans = async (req, res) => {
  try {
    const { userId } = req.params;

    const Ilans = await Ilan.find({ olusturan: userId });

    res.status(200).json({ Ilans });
  } catch (error) {
    res.status(500).json({ message: "birşey yanlış gitti." });
  }
};
export const getisVerifiedIlan = async (req, res) => {
  try {
    const { userId } = req.params;

    const ilan = await Ilan.findById(userId);
    if (!ilan) {
      return res.status(404).json({ message: "İlan bulunamadı." });
    }

    ilan.isVerified = true; // Set isVerified to true
    await ilan.save(); // Save the updated listing

    res.status(200).json("ok");
  } catch (error) {
    console.error("İlan doğrulama hatası:", error);
    res.status(500).json({ message: "Bir şeyler yanlış gitti." });
  }
};
export const getUsersDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const users = await User.find({ _id: userId });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Bir şeyler yanlış gitti." });
  }
};
export const getIlanDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const Ilans = await Ilan.find({ _id: userId });

    res.status(200).json(Ilans);
  } catch (error) {
    res.status(500).json({ message: "Bir şeyler yanlış gitti." });
  }
};
