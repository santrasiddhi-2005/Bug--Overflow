import express from "express";
import {
  addQuestionComment,
  addAnswerComment,
  deleteQuestionComment,
  deleteAnswerComment,
} from "../controllers/Comments.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/question/:id", auth, addQuestionComment);
router.post("/answer/:id", auth, addAnswerComment);
router.delete("/question/:questionId/:commentId", auth, deleteQuestionComment);
router.delete("/answer/:questionId/:answerId/:commentId", auth, deleteAnswerComment);

export default router;
