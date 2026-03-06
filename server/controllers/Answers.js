import mongoose from "mongoose";
import Questions from "../models/Questions.js";
import { updateReputation, addNotification } from "../utils/reputation.js";

export const postAnswer = async (req, res) => {
  const { id: _id } = req.params;
  const { noOfAnswers, answerBody, userAnswered } = req.body;
  const userId = req.userId;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  updateNoOfQuestions(_id, noOfAnswers);
  try {
    const updatedQuestion = await Questions.findByIdAndUpdate(
      _id,
      { $addToSet: { answer: [{ answerBody, userAnswered, userId }] } },
      { new: true }
    );

    // Award "Teacher" badge and notify question author
    updateReputation(userId, 0, { hasAnswered: true }).catch(console.error);
    if (updatedQuestion.userId && String(updatedQuestion.userId) !== String(userId)) {
      addNotification(
        updatedQuestion.userId,
        `Your question "${updatedQuestion.questionTitle}" received a new answer.`,
        `/Questions/${_id}`
      ).catch(console.error);
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(400).json("error in updating");
  }
};

const updateNoOfQuestions = async (_id, noOfAnswers) => {
  try {
    await Questions.findByIdAndUpdate(_id, {
      $set: { noOfAnswers: noOfAnswers },
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteAnswer = async (req, res) => {
  const { id: _id } = req.params;
  const { answerId, noOfAnswers } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Question unavailable...");
  }
  if (!mongoose.Types.ObjectId.isValid(answerId)) {
    return res.status(404).send("Answer unavailable...");
  }
  updateNoOfQuestions(_id, noOfAnswers);
  try {
    await Questions.updateOne(
      { _id },
      { $pull: { answer: { _id: answerId } } }
    );
    res.status(200).json({ message: "Successfully deleted..." });
  } catch (error) {
    res.status(405).json(error);
  }
};

export const acceptAnswer = async (req, res) => {
  const { id: _id } = req.params; // questionId
  const { answerId } = req.body;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Question unavailable...");
  }

  try {
    const question = await Questions.findById(_id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (String(question.userId) !== String(userId)) {
      return res.status(403).json({ message: "Only the question author can accept an answer" });
    }

    question.acceptedAnswer = answerId;
    question.status = "answered";
    await question.save();

    // Give reputation to the answer author
    const acceptedAns = question.answer.find((a) => String(a._id) === String(answerId));
    if (acceptedAns?.userId) {
      updateReputation(acceptedAns.userId, 15, {}).catch(console.error);
      addNotification(
        acceptedAns.userId,
        `Your answer was accepted on "${question.questionTitle}".`,
        `/Questions/${_id}`
      ).catch(console.error);
    }

    res.status(200).json({ message: "Answer accepted successfully", question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const voteAnswer = async (req, res) => {
  const { questionId, answerId } = req.params;
  const { value } = req.body;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send("Question unavailable...");
  }

  try {
    const question = await Questions.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answer = question.answer.find((a) => String(a._id) === String(answerId));
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    const upIndex = answer.upVote.findIndex((id) => id === String(userId));
    const downIndex = answer.downVote.findIndex((id) => id === String(userId));

    let repDelta = 0;

    if (value === "upVote") {
      if (downIndex !== -1) {
        answer.downVote = answer.downVote.filter((id) => id !== String(userId));
        repDelta += 2; // remove the -2 downvote penalty (un-downvoting)
      }
      if (upIndex === -1) {
        answer.upVote.push(userId);
        repDelta += 10;
      } else {
        answer.upVote = answer.upVote.filter((id) => id !== String(userId));
        repDelta -= 10;
      }
    } else if (value === "downVote") {
      if (upIndex !== -1) {
        answer.upVote = answer.upVote.filter((id) => id !== String(userId));
        repDelta -= 10; // remove the +10 upvote bonus
      }
      if (downIndex === -1) {
        answer.downVote.push(userId);
        repDelta -= 2;
      } else {
        answer.downVote = answer.downVote.filter((id) => id !== String(userId));
        repDelta += 2; // remove the -2 downvote penalty (un-downvoting)
      }
    }

    await question.save();

    if (repDelta !== 0 && answer.userId) {
      const stats = { answerUpVotes: answer.upVote.length };
      updateReputation(answer.userId, repDelta, stats).catch(console.error);

      if (repDelta > 0 && String(answer.userId) !== String(userId)) {
        addNotification(
          answer.userId,
          `Your answer received an upvote on "${question.questionTitle}".`,
          `/Questions/${questionId}`
        ).catch(console.error);
      }
    }

    res.status(200).json({ message: "Answer voted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
