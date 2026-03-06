import mongoose from "mongoose";
import Questions from "../models/Questions.js";

// POST /comments/question/:id
export const addQuestionComment = async (req, res) => {
  const { id: questionId } = req.params;
  const { commentBody } = req.body;
  const userId = req.userId;
  const userCommented = req.body.userCommented;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send("Question unavailable...");
  }
  if (!commentBody || !userCommented) {
    return res.status(400).json({ message: "commentBody and userCommented are required" });
  }

  try {
    const question = await Questions.findByIdAndUpdate(
      questionId,
      { $push: { comments: { commentBody, userCommented, userId } } },
      { new: true }
    );
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /comments/answer/:id  (id = questionId, body has answerId)
export const addAnswerComment = async (req, res) => {
  const { id: questionId } = req.params;
  const { answerId, commentBody, userCommented } = req.body;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send("Question unavailable...");
  }
  if (!commentBody || !userCommented || !answerId) {
    return res.status(400).json({ message: "answerId, commentBody, and userCommented are required" });
  }

  try {
    const question = await Questions.findOneAndUpdate(
      { _id: questionId, "answer._id": answerId },
      { $push: { "answer.$.comments": { commentBody, userCommented, userId } } },
      { new: true }
    );
    if (!question) return res.status(404).json({ message: "Question or answer not found" });
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /comments/question/:questionId/:commentId
export const deleteQuestionComment = async (req, res) => {
  const { questionId, commentId } = req.params;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send("Question unavailable...");
  }

  try {
    const question = await Questions.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const comment = question.comments.find((c) => String(c._id) === String(commentId));
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (String(comment.userId) !== String(userId)) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Questions.findByIdAndUpdate(questionId, {
      $pull: { comments: { _id: commentId } },
    });
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /comments/answer/:questionId/:answerId/:commentId
export const deleteAnswerComment = async (req, res) => {
  const { questionId, answerId, commentId } = req.params;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send("Question unavailable...");
  }

  try {
    const question = await Questions.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answer = question.answer.find((a) => String(a._id) === String(answerId));
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    const comment = answer.comments.find((c) => String(c._id) === String(commentId));
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (String(comment.userId) !== String(userId)) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Questions.findOneAndUpdate(
      { _id: questionId, "answer._id": answerId },
      { $pull: { "answer.$.comments": { _id: commentId } } }
    );
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
