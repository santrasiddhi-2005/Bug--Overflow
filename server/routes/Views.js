import express from "express";
import { incrementView } from "../controllers/Views.js";

const router = express.Router();

router.patch("/:id", incrementView);

export default router;
