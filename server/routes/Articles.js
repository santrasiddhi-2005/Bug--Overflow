import express from "express";
import auth from "../middleware/auth.js";
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/Articles.js";

const router = express.Router();

router.get("/get", getAllArticles);
router.get("/:id", getArticleById);
router.post("/create", auth, createArticle);
router.patch("/update/:id", auth, updateArticle);
router.delete("/delete/:id", auth, deleteArticle);

export default router;
