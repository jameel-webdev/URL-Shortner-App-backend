import express from "express";
import { fullUrl, shortUrl } from "../controllers/urlControllers.js";

const router = express.Router();

router.route("/fullurl").post(fullUrl);

router.route("/:shorturl").get(shortUrl);

export default router;
