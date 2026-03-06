import express from "express";
import {
	getBookmarks,
	addBookmark,
	removeBookmark,
	addArticleBookmark,
	removeArticleBookmark,
} from "../controllers/Bookmarks.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getBookmarks);
router.post("/add", auth, addBookmark);
router.delete("/remove", auth, removeBookmark);
router.post("/add-article", auth, addArticleBookmark);
router.delete("/remove-article", auth, removeArticleBookmark);

export default router;
