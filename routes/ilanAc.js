import express from "express";
import { fileURLToPath } from "url";
import { getSingleIlan, ilanKaydet } from "../controllers/ilan.js";
import multer from "multer";
import path from "path";

import { verifyToken } from "../middleware/auth.js";
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ilanUploads = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "ilanresim/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router.get("/singleIlan/:ilan_baslik=:ilan_no", getSingleIlan);
router.post("/yeni", verifyToken, ilanUploads.array("images", 12), ilanKaydet);
/* router.post("/yeni",ilanKaydet); */

export default router;

/* if(req.files){
  console.log(req.files)
res.status(200).json("foto başarıyla upload edildi")} */
