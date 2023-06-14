import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userAuth.js";
import googleRoutes from "./routes/googleRoutes.js";
import ilan from "./routes/ilanAc.js";
import users from "./routes/users.js";
import select from "./routes/select.js";
import admins from "./routes/admins.js";
import homeilan from "./routes/homeilan.js";
import cookieParser from "cookie-parser";
import User from "./models/user.js";
import Ilan from "./models/ilan.js";
import cron from "node-cron";
import mime from "mime-types";
import { verifyToken } from "./middleware/auth.js";

// Configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.static("ilanresim"));

const staticMiddleware = express.static("uploads");
mime.getType = mime.lookup;
staticMiddleware.mime = mime;
app.use("/uploads", staticMiddleware);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Resim yükleme endpoint'i

app.post(
  "/api/upload",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    const user = await User.findById(req.user.id);

    const { originalname, path } = req.file;
    const newImage = {
      profileImage: {
        name: originalname,
        path: path,
      },
      defaultProfileImage: null, // Set defaultProfileImage to null
    };

    User.findOneAndUpdate({ _id: user._id }, newImage, { new: true })
      .then((user) => {
        res.status(200).json({ message: "Image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Internal Server Error");
      });
  }
);
// Routes
app.use("/auth", userRoutes);
app.use("/google", googleRoutes);
app.use("/admin", admins);
app.use("/home", homeilan);
app.use("/profile", verifyToken, users);
app.use("/select", select);
app.use("/ilanver", ilan);
// Delete unverified users scheduled task
const deleteunverifiedusers = async () => {
  try {
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    const unverifiedUsers = await User.find({
      isVerified: false,
      regDate: { $lt: fortyEightHoursAgo },
    });

    for (const user of unverifiedUsers) {
      await User.deleteOne({ _id: user._id });
      console.log(`Deleted unverified user: ${user.name}`);
    }

    console.log("Deleted unverified users.");
  } catch (error) {
    console.error("An error occurred while deleting unverified users:", error);
  }
};

const checkExpiredListings = async () => {
  try {
    const currentDate = new Date();
    const expiredListings = await Ilan.find({
      kurs_bitirme_tarihi: { $lte: currentDate },
      isVerified: true,
    });

    for (const ilan of expiredListings) {
      Ilan.isVerified = false;
      await Ilan.save();
    }

    console.log("Süresi bitmiş ilanlar kontrol edildi.");
  } catch (error) {
    console.error(
      "Süresi bitmiş ilanları kontrol ederken bir hata oluştu:",
      error
    );
  }
};

// Mongoose config
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Server başlatıldığında zamanlanmış görevi başlat
    cron.schedule("0 0 * * *", () => {
      deleteunverifiedusers()
        .then(() => console.log("Doğrulanmamış kullanıcılar silindi."))
        .catch((error) =>
          console.log(
            "Doğrulanmamış kullanıcıları silerken bir hata oluştu:",
            error
          )
        );
    });

    setInterval(checkExpiredListings, 60 * 60 * 1000);

    app.listen(PORT, () =>
      console.log("Server çalışıyor: http://localhost:3001")
    );
  })
  .catch((error) => console.log(error));
