import express from "express";

import { getIlans,getKategoriliIlans } from "../controllers/homeilan.js";

const router = express.Router();

router.get("/ilan", getIlans);
router.get("/:kategori/ilan",getKategoriliIlans)
router.get("/:kategori/:alt_kategori/ilan",getKategoriliIlans)
export default router;
