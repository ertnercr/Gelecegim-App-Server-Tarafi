import express from "express";
import {
  getUser,
  updateProfileController,
  deleteProfilePicture,
  userDelete,
  changePassword,
  getUserMenu,
  updateIlanController,
  getUserIlan,
  IlanProblem,
} from "../controllers/users.js";
const router = express.Router();

/* READ */
router.get("/", getUser);
router.get("/Ilan", getUserIlan);
router.post("/Ilan/problem", IlanProblem);
router.get("/menu", getUserMenu);
router.post("/controller", updateProfileController);
router.delete("/delete", deleteProfilePicture);
router.post("/userDelete", userDelete);
router.post("/changePassword", changePassword);
router.post("/ilan-controller", updateIlanController);

export default router;
