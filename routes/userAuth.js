import express from "express";

import {
  sendActivationEmail,
  sendActivationEmailForgot,
} from "../controllers/mailController.js";
import {
  login,
  signup,
  forgotPasswordController,
  changepassword,
  signUpController,
  deleteUser,
} from "../controllers/userAuth.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/signup/:id/:token", signUpController);
router.delete("/signup/delete/:id/:token", deleteUser);
router.post("/activation", sendActivationEmail);
router.post("/activation/forgotPassword", sendActivationEmailForgot);
router.get("/forgotpassword/:id/:token", forgotPasswordController);
router.post("/:id/:token", changepassword);

export default router;
