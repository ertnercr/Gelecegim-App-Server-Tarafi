import express from "express";

import { getIlceler, getIl, getVdAd, getKurum } from "../controllers/iller.js";
import { getAltAlan } from "../controllers/ilan.js";
const router = express.Router();

router.get("/Iller", getIl);
router.get("/Ilceler/:ad", getIlceler);
router.get("/Kurum", getKurum);
router.get("/vdAd/:ad", getVdAd);
router.get("/altAlan/:ad",getAltAlan)
export default router;
