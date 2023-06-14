import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
dotenv.config();
import dotenv from "dotenv";
import { sendActivationEmail } from "./mailController.js";
const keysecret = process.env.SECRET_KEY;

//-------------------------------------------------------------------------------------------LOGİN-----------------------------------------------------------------------------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser.isVerified === false)
      return res.status(400).json({ message: "mail onaylanmamış." });

    if (!existingUser)
      return res.status(400).json({ message: "Kullanıcı mevcut degil." });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "geçersiz şifre" });

    const token = jwt.sign({ id: existingUser._id }, keysecret);
    res.status(200).json({ token, user: existingUser.hesapTuru });
  } catch (error) {
    res.status(500).json({ message: "birşey yanlış gitti." });
  }
};

//-------------------------------------------------------------------------------------------LOGİN-----------------------------------------------------------------------------------------------

////-------------------------------------------------------------------------------------------SİGNUP-----------------------------------------------------------------------------------------------

export const signup = async (req, res) => {
  function formatDate(date) {
    const yil = date.getUTCFullYear();
    const ay = date.getUTCMonth();
    const gun = date.getUTCDate();
    const tarih = `${gun}/${ay + 1}/${yil}`;
    return tarih;
  }

  try {
    const {
      name,
      surname,
      email,
      password,
      phone,
      business,
      il,
      ilce,
      hesapTuru,
      vdil,
      vdad,
      tcno,
      vkNo,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email adresi kayıtlıdır." });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
   
    const bugun=new Date()
    const kayit_tarihi=formatDate(bugun)
    console.log(kayit_tarihi)
    let IlanSayisi;
    if (hesapTuru!=="Bireysel")
    {IlanSayisi=0}
    const newBusiness = new User({
      name,
      surname,
      email,
      password: passwordHash,
      phone,
      business,
      il,
      ilce,
      hesapTuru,
      vdil,
      vdad,
      tcno,
      vkNo,
      regDate: kayit_tarihi,
      isVerified: false,
      Ilan:IlanSayisi,
    });

    await newBusiness.save();
    sendActivationEmail(newBusiness.email);
    res.status(200).json(newBusiness);
  } catch (error) {
    res.status(400).json(error);
    console.log(error.message);
  }
};
////-------------------------------------------------------------------------------------------SİGNUP-----------------------------------------------------------------------------------------------

////-------------------------------------------------------------------------------------------SİGNUPCONTROLLER-----------------------------------------------------------------------------------------------

export const signUpController = async (req, res) => {
  const { id, token } = req.params;

  try {
    const validuser = await User.findOne({ _id: id, verifytoken: token });

    const verifyToken = jwt.verify(token, keysecret);

    if (validuser && verifyToken._id) {
      const setnewuserpass = await User.findByIdAndUpdate(
        { _id: id },
        { isVerified: true }
      );
      res.status(201).json({ status: 201, setnewuserpass });
      setnewuserpass.save();
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};
////-------------------------------------------------------------------------------------------SİGNUPCONTROLLER-----------------------------------------------------------------------------------------------

export const deleteUser = async (req, res) => {
  const { id, token } = req.params;

  try {
    const validuser = await User.findOne({ _id: id, verifytoken: token });
    if (validuser.isVerified === true) {
      return res.status(400).json({ message: "hesap kayıtlıdır." });
    }
    const verifyToken = jwt.verify(token, keysecret);

    if (validuser && verifyToken._id) {
      await validuser.deleteOne();
      return res
        .status(200)
        .json({ status: 200, message: "Kullanıcı başarıyla silindi" });
    } else {
      res.status(401).json({ status: 401 });
      return res.status(500).json({
        status: 500,
        message: "Kullanıcı silinirken bir hata oluştu",
      });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};
/* export const sendActivationEmailForgot = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(401).json({ status: 401, message: "Enter Your Email" });
  }
  try {
    const userfind = await User.findOne({ email: email });

    // token generate for reset password
    const payload = {
      _id: userfind._id,
    };
    const token = jwt.sign(payload, keysecret, {
      expiresIn: "120s",
    });

    const setusertoken = await User.findByIdAndUpdate(
      { _id: userfind._id },
      { verifytoken: token },
      { new: true }
    );

    if (setusertoken) {
      const mailOptions = mailjetClient
        .post("send", { version: "v3.1" })
        .request({
          Messages: [
            {
              From: {
                Email: process.env.MAILJET_SENDERMAIL,
                Name: "Geleceğim",
              },
              To: [
                {
                  Email: email,
                },
              ],
              Subject: "Şifrenizi Sıfırlayın",
              HTMLPart: `<p> Sayın ${userfind.name} ${userfind.surname} Bu mail isteğiniz üzere şifrenizi sıfırlamanız için gönderilmiştir.
          
          <h1> Bu Link Sadece 2 Dakikalığına Geçerlidir. http://localhost:3000/auth/forgotpassword/${userfind._id}/${setusertoken.verifytoken} </h1> </p>`,
            },
          ],
        });
      res.status(201).json(mailOptions);
    }
  } catch (error) {
    res.status(401).json({ status: 401, message: "invalid user" });
  }
}; */

// verify user for forgot password time
export const forgotPasswordController = async (req, res) => {
  const { id, token } = req.params;

  try {
    const validuser = await User.findOne({ _id: id, verifytoken: token });

    const verifyToken = jwt.verify(token, keysecret);

    if (validuser && verifyToken._id) {
      res.status(201).json({ status: 201, validuser });
    } else {
      res.status(401).json({ status: 401, message: "user not exist" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};

// change password
////-------------------------------------------------------------------------------------------CHANGEPASSWORD-----------------------------------------------------------------------------------------------

export const changepassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    const validuser = await User.findOne({ _id: id, verifytoken: token });

    if (!validuser) {
      return res
        .status(401)
        .json({ status: 401, message: "Geçerli kullanıcı bulunamadı" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      validuser.password
    );

    if (isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Yeni şifreniz eski şifrenizle aynı olamaz" });
    }

    const verifyToken = jwt.verify(token, keysecret);

    if (verifyToken._id.toString() === id) {
      const newpassword = await bcrypt.hash(password, 12);

      validuser.password = newpassword;
      await validuser.save();

      res
        .status(201)
        .json({ status: 201, message: "Şifre başarıyla değiştirildi" });
    } else {
      res.status(401).json({
        status: 401,
        message: "Geçersiz token veya kullanıcı kimliği",
      });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};
////-------------------------------------------------------------------------------------------CHANGEPASSWORD-----------------------------------------------------------------------------------------------
import { OAuth2Client } from "google-auth-library";

const CLIENT_ID =
  "720751432082-6rjlgjra120suv5ps4e8qdu47h4ougq2.apps.googleusercontent.com";

const verifyGoogleToken = async (idToken) => {
  const client = new OAuth2Client(CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.given_name;
    const surname = payload.family_name;
    const picture = payload.picture;
    const hesapTuru = "Bireysel";
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Mevcut kullanıcı varsa işlem yapabilirsiniz
      // ...
    } else {
      // Yeni kullanıcıysa, kullanıcıyı kaydedin
      const newUser = new User({
        email: email,
        name: name,
        surname: surname,
        defaultProfileImage: picture,
        hesapTuru: hesapTuru,
        // Diğer kullanıcı bilgilerini de burada kaydedebilirsiniz
      });

      await newUser.save(); // Kullanıcıyı veritabanına kaydedin

      // ...
    }
    const userfind = await User.findOne({ email: email });
    const userId = {
      id: userfind._id,
    };
    const token = jwt.sign(userId, keysecret);
    await User.findByIdAndUpdate(
      { _id: userfind._id },
      { verifytoken: token },
      { new: true }
    );
    return { token, user: userfind.hesapTuru };
  } catch (error) {
    throw new Error("Google doğrulama hatası");
  }
};

export const googlelogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Google hesabıyla girişi doğrula
    const { token, user } = await verifyGoogleToken(idToken);
    // Başarılı giriş yanıtı
    res.json({ token, user });
  } catch (error) {
    // Giriş hatası durumunda hata yanıtı
    res.status(401).json({ error: "Google doğrulama hatası" });
  }
};
