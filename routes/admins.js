import express from "express";

import {
  login,
  getUsers,
  getUsersIlan,
  getIlans,
  getisVerifiedIlan,
  getUsersDetails,
  DeleteUsers,
  DeleteIlans,
  getIlanDetails,
} from "../controllers/adminAuth.js";

const router = express.Router();

router.post("/auth/login", login);
//user ve Ilanların hepsini getirme
router.get("/users", getUsers);
router.get("/ilans", getIlans);
//Userın ilanlarını getirme
router.get("/users/ilanlar/:userId", getUsersIlan);
//Ilan ve User detayları
router.get("/users/details/:userId", getUsersDetails);
router.get("/ilans/details/:userId", getIlanDetails);

router.get("/ilanlar/isVerified/:userId", getisVerifiedIlan);
//Ilan ve User delete
router.delete("/users/delete/:userId", DeleteUsers);
router.delete("/ilanlar/delete/:userId", DeleteIlans);
export default router;
