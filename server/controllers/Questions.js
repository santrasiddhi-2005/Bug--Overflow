import Questions from "../models/Questions.js";
import mongoose from "mongoose";
import { updateReputation, addNotification } from "../utils/reputation.js";

export const AskQuestion = async (req, res) => {
  const postQuestionData = req.body;
  const userId = req.userId;
  const postQuestion = new Questions({ ...postQuestionData, userId });
  try {
    await postQuestion.save();
    // Award "Student" badge for asking first question (no rep delta)
    updateReputation(userId, 0, { hasAskedQuestion: true }).catch(console.error);
    res.status(200).json("Posted a question successfully");
  } catch (error) {
    console.log(error);
    res.status(409).json("Couldn't post a new question");
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const questionList = await Questions.find().sort({ askedOn: -1 });
    res.status(200).json(questionList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const searchQuestions = async (req, res) => {
  const { query, limit = 10, skip = 0 } = req.query;
  try {
    if (!query || query.trim() === "") {
      return res.status(200).json({ questions: [], total: 0 });
    }

    const searchQuery = query.trim();
    const skipNum = parseInt(skip) || 0;
    const limitNum = Math.min(parseInt(limit) || 10, 50); // Max 50 results

    const searchFilter = {
      $or: [
        { questionTitle: { $regex: searchQuery, $options: "i" } },
        { questionBody: { $regex: searchQuery, $options: "i" } },
        { questionTags: { $elemMatch: { $regex: searchQuery, $options: "i" } } },
      ],
    };

    const total = await Questions.countDocuments(searchFilter);
    const questionList = await Questions.find(searchFilter)
      .select("_id questionTitle questionBody questionTags noOfAnswers upVote downVote askedOn userPosted userId views status")
      .sort({ askedOn: -1 })
      .skip(skipNum)
      .limit(limitNum)
      .lean();

    res.status(200).json({ questions: questionList, total, limit: limitNum, skip: skipNum });
  } catch (error) {
    console.error("Search questions error:", error);
    res.status(500).json({ message: "Error searching questions", error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    await Questions.findByIdAndRemove(_id);
    res.status(200).json({ message: "successfully deleted..." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const voteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value } = req.body;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    const question = await Questions.findById(_id);
    if (!question) {
      return res.status(404).json({ message: "question not found" });
    }

    if (String(question.userId) === String(userId)) {
      return res
        .status(403)
        .json({ message: "You cannot vote on your own question" });
    }

    question.upVote = Array.isArray(question.upVote) ? question.upVote : [];
    question.downVote = Array.isArray(question.downVote) ? question.downVote : [];

    const upIndex = question.upVote.findIndex((id) => id === String(userId));
    const downIndex = question.downVote.findIndex(
      (id) => id === String(userId)
    );

    let repDelta = 0;

    if (value === "upVote") {
      if (downIndex !== -1) {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
        repDelta += 5; // reversing a downvote
      }
      if (upIndex === -1) {
        question.upVote.push(userId);
        repDelta += 5;
      } else {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
        repDelta -= 5;
      }
    } else if (value === "downVote") {
      if (upIndex !== -1) {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
        repDelta -= 5; // reversing an upvote
      }
      if (downIndex === -1) {
        question.downVote.push(userId);
        repDelta -= 5;
      } else {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
        repDelta += 5;
      }
    }
    await Questions.findByIdAndUpdate(_id, question);

    // Update question author's reputation and notify
    if (repDelta !== 0 && question.userId) {
      const stats = { questionUpVotes: question.upVote.length };
      updateReputation(question.userId, repDelta, stats).catch(console.error);

      if (repDelta > 0 && String(question.userId) !== String(userId)) {
        addNotification(
          question.userId,
          `Your question "${question.questionTitle}" received an upvote.`,
          `/Questions/${_id}`
        ).catch(console.error);
      }
    }

    res.status(200).json({ message: "voted successfully..." });
  } catch (error) {
    res.status(404).json({ message: "id not found" });
  }
};
