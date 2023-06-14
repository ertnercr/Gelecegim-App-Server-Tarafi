import express from "express";

import { googlelogin } from "../controllers/userAuth.js";

const router = express.Router();

router.post("/login", googlelogin);

export default router;
