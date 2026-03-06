import express from "express";

import { postAnswer, deleteAnswer, acceptAnswer, voteAnswer } from "../controllers/Answers.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.patch("/post/:id", auth, postAnswer);
router.patch("/delete/:id", auth, deleteAnswer);
router.patch("/accept/:id", auth, acceptAnswer);
router.patch("/vote/:questionId/:answerId", auth, voteAnswer);

export default router;
