import mongoose from "mongoose";
import Questions from "../models/Questions.js";
import { updateReputation } from "../utils/reputation.js";

// PATCH /views/:id
export const incrementView = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Question unavailable...");
  }

  try {
    const question = await Questions.findByIdAndUpdate(
      _id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!question) return res.status(404).json({ message: "Question not found" });

    // Check "Popular Question" badge at 1000 views
    if (question.views >= 1000 && question.userId) {
      updateReputation(question.userId, 0, { questionViews: question.views }).catch(console.error);
    }

    res.status(200).json({ views: question.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
