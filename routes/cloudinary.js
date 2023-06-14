import express from "express";
const router = express.Router();

import {upload,remove} from "../controllers/cloudinaryprocess.js"
router.post("/uploadimages",upload)
router.post("/removeimages",remove)