// profileController.js
import bcrypt from "bcrypt";
import User from "../models/user.js";
import Ilan from "../models/ilan.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new Error("Kullanıcı bulunamadı.");
    }

    // Check if the profile image path exists
    if (user.profileImage && user.profileImage.path) {
      const imagePath = path.join(__dirname, "..", user.profileImage.path);

      // Delete the file from the disk
      fs.unlink(imagePath, (error) => {
        if (error) {
          throw error;
        }
      });
    }

    // Reset the profile image fields
    user.profileImage = {
      name: null,
      path: null,
    };
    user.defaultProfileImage = "uploads/default-resim.png";

    await user.save();
    res.json({ message: "Profil resmi silindi." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Profil resmi silinirken bir hata oluştu." });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const { name, surname, profileImage } = req.body;
    // Diğer kullanıcı bilgilerini güncelleme
    user.name = name || user.name;
    user.surname = surname || user.surname;
    user.profileImage.path = profileImage || user.profileImage.path;
    await user.save();

    res.status(200).send({ user });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: "Profil güncellenirken bir hata oluştu.",
      error,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    const {
      name,
      surname,
      email,
      business,
      vdil,
      vdad,
      phone,
      il,
      ilce,
      vkNo,
      tcno,
      defaultProfileImage,
      profileImage,
    } = user;
    res.status(200).json({
      name,
      surname,
      email,
      business,
      vdil,
      vdad,
      phone,
      il,
      ilce,
      vkNo,
      tcno,
      defaultProfileImage,
      profileImage,
    });
  } catch (error) {
    console.log("Profil alınamadı:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
export const getUserIlan = async (req, res) => {
  try {
    const ilan = await Ilan.find({ olusturan: req.user.id });
    const ilanList = ilan.map((ad) => ({
      baslik: ad.baslik,
      kategori: ad.kategori,
      alt_kategori: ad.alt_kategori,
      ilan_no: ad.ilan_no,
      ilan_tarihi: ad.ilan_tarihi,
      ilan_bitis_Tarihi: ad.ilan_bitis_Tarihi,
    }));

    res.status(200).json(ilanList);
  } catch (error) {
    console.log("Profil alınamadı:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const getUserMenu = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    const { name, surname } = user;

    res.status(200).json({
      name,
      surname,
    });
  } catch (error) {
    console.log("Profil alınamadı:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const changePassword = async (req, res) => {
  const { password, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ status: 404, message: "Kullanıcı bulunamadı" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      user.password = hashedNewPassword;
      await user.save();

      return res.status(200).json({
        status: 200,
        message: "Şifre Başarılı Bir Şekilde Değiştirildi.",
      });
    } else {
      return res
        .status(401)
        .json({ status: 401, message: "Girilen şifre yanlış" });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
};

export const userDelete = async (req, res) => {
  const { password } = req.body;
  try {
    // Kullanıcıyı bulma
    const user = await User.findById(req.user.id);
    // Şifre kontrolü
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      // Kullanıcıyı silme
      try {
        await user.deleteOne();
        return res
          .status(200)
          .json({ status: 200, message: "Kullanıcı başarıyla silindi" });
      } catch (error) {
        return res.status(500).json({
          status: 500,
          message: "Kullanıcı silinirken bir hata oluştu",
        });
      }
    } else {
      return res.status(400).json({ message: "Girilen şifre yanlış" });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, error });
  }
};

export const updateIlanController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const { name, surname, profileImage } = req.body;

    // Diğer kullanıcı bilgilerini güncelleme
    user.name = name || user.name;
    user.surname = surname || user.surname;
    user.profileImage.path = profileImage || user.profileImage.path;
    await user.save();

    res.status(200).send({ user });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: "Profil güncellenirken bir hata oluştu.",
      error,
    });
  }
};

export const IlanProblem = async (req, res) => {
  try {
    const ilan = await Ilan.findOne({ olusturan: req.user.id });

    if (!ilan) {
      return res.status(404).send({
        success: false,
        message: "İlan bulunamadı.",
      });
    }

    const { problemDescription } = req.body;

    // Update the problemDescription of the ilan object
    ilan.problemDescription = problemDescription;

    await ilan.save();

    res.status(200).send({
      success: true,
      message: "İlan problemi başarıyla gönderildi.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "İlan problemi güncellenirken bir hata oluştu.",
      error: error.message,
    });
  }
};
