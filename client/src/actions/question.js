import * as api from "../api/index";

export const askQuestion = (questionData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.postQuestion(questionData);
    dispatch({ type: "POST_QUESTION", payload: data });
    dispatch(fetchAllQuestions());
    navigate("/");
  } catch (error) {
    console.log(error);
  }
};

export const fetchAllQuestions = () => async (disptach) => {
  try {
    const { data } = await api.getAllQuestions();
    disptach({ type: "FETCH_ALL_QUESTIONS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deleteQuestion = (id, navigate) => async (dispatch) => {
  try {
    await api.deleteQuestion(id);
    dispatch(fetchAllQuestions());
    navigate("/");
  } catch (error) {
    console.log(error);
  }
};

export const voteQuestion = (id, value) => async (dispatch) => {
  try {
    await api.voteQuestion(id, value);
    dispatch(fetchAllQuestions());
  } catch (error) {
    console.log(error);
  }
};

export const postAnswer = (answerData) => async (dispatch) => {
  try {
    const { id, noOfAnswers, answerBody, userAnswered } = answerData;
    const { data } = await api.postAnswer(
      id,
      noOfAnswers,
      answerBody,
      userAnswered
    );
    dispatch({ type: "POST_ANSWER", payload: data });
    dispatch(fetchAllQuestions());
  } catch (error) {
    console.log(error);
  }
};

export const deleteAnswer = (id, answerId, noOfAnswers) => async (dispatch) => {
  try {
    await api.deleteAnswer(id, answerId, noOfAnswers);
    dispatch(fetchAllQuestions());
  } catch (error) {
    console.log(error);
  }
};

export const acceptAnswer = (questionId, answerId) => async (dispatch) => {
  try {
    await api.acceptAnswer(questionId, answerId);
    dispatch(fetchAllQuestions());
  } catch (error) {
    console.log(error);
  }
};

export const voteAnswer = (questionId, answerId, value) => async (dispatch) => {
  try {
    await api.voteAnswer(questionId, answerId, value);
    dispatch(fetchAllQuestions());
  } catch (error) {
    console.log(error);
  }
};

export const incrementView = (questionId) => async (dispatch) => {
  try {
    await api.incrementView(questionId);
    dispatch(fetchAllQuestions());
  } catch (error) {
    console.log(error);
  }
};

export const addQuestionComment = (questionId, commentBody, userCommented) => async (dispatch) => {
  try {
    await api.addQuestionComment(questionId, commentBody, userCommented);
    dispatch(fetchAllQuestions());
  } catch (error) {
    console.log(error);
  }
};

export const addAnswerComment = (questionId, answerId, commentBody, userCommented) => async (dispatch) => {
  try {
    await api.addAnswerComment(questionId, answerId, commentBody, userCommented);
    dispatch(fetchAllQuestions());
  } catch (error) {
    console.log(error);
  }
};

export const deleteQuestionComment = (questionId, commentId) => async (dispatch) => {
  try {
    await api.deleteQuestionComment(questionId, commentId);
    dispatch(fetchAllQuestions());
  } catch (error) {
    console.log(error);
  }
};

export const deleteAnswerComment = (questionId, answerId, commentId) => async (dispatch) => {
  try {
    await api.deleteAnswerComment(questionId, answerId, commentId);
    dispatch(fetchAllQuestions());
  } catch (error) {
    console.log(error);
  }
};
