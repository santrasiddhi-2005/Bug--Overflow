import axios from "axios";

const API = axios.create({
  baseURL: "https://bug-overflow.onrender.com/",
  // baseURL: "http://localhost:5000/"
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("Profile")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("Profile")).token
    }`;
  }
  return req;
});

export const logIn = (authData) => API.post("/user/login", authData);
export const signUp = (authData) => API.post("/user/signup", authData);
export const verifySignupOtp = (payload) => API.post("/user/verify-signup-otp", payload);
export const resendSignupOtp = (payload) => API.post("/user/resend-signup-otp", payload);
export const forgotPassword = (payload) => API.post("/user/forgot-password", payload);
export const verifyResetOtp = (payload) => API.post("/user/verify-reset-otp", payload);
export const resetPassword = (payload) => API.post("/user/reset-password", payload);

export const postQuestion = (questionData) =>
  API.post("/questions/Ask", questionData);
export const getAllQuestions = () => API.get("/questions/get");
export const deleteQuestion = (id) => API.delete(`/questions/delete/${id}`);
export const voteQuestion = (id, value) =>
  API.patch(`/questions/vote/${id}`, { value });

// Articles
export const getAllArticles = () => API.get("/articles/get");
export const getArticleById = (id) => API.get(`/articles/${id}`);
export const createArticle = (articleData) => API.post("/articles/create", articleData);
export const updateArticle = (id, articleData) => API.patch(`/articles/update/${id}`, articleData);
export const deleteArticle = (id) => API.delete(`/articles/delete/${id}`);

export const postAnswer = (id, noOfAnswers, answerBody, userAnswered) =>
  API.patch(`/answer/post/${id}`, { noOfAnswers, answerBody, userAnswered });
export const deleteAnswer = (id, answerId, noOfAnswers) =>
  API.patch(`/answer/delete/${id}`, { answerId, noOfAnswers });

export const getAllUsers = () => API.get("/user/getAllUsers");
export const searchUsers = (query, limit = 10, skip = 0) =>
  API.get(`/user/search?query=${query}&limit=${limit}&skip=${skip}`);
export const searchQuestions = (query, limit = 10, skip = 0) =>
  API.get(`/questions/search?query=${query}&limit=${limit}&skip=${skip}`);
export const searchTags = (query, limit = 10) =>
  API.get(`/user/tags/search?query=${query}&limit=${limit}`);
export const updateProfile = (id, updateData) =>
  API.patch(`/user/update/${id}`, updateData);

// Answer operations
export const acceptAnswer = (questionId, answerId) =>
  API.patch(`/answer/accept/${questionId}`, { answerId });
export const voteAnswer = (questionId, answerId, value) =>
  API.patch(`/answer/vote/${questionId}/${answerId}`, { value });

// View tracking
export const incrementView = (id) => API.patch(`/views/${id}`);

// Comments
export const addQuestionComment = (questionId, commentBody, userCommented) =>
  API.post(`/comments/question/${questionId}`, { commentBody, userCommented });
export const addAnswerComment = (questionId, answerId, commentBody, userCommented) =>
  API.post(`/comments/answer/${questionId}`, { answerId, commentBody, userCommented });
export const deleteQuestionComment = (questionId, commentId) =>
  API.delete(`/comments/question/${questionId}/${commentId}`);
export const deleteAnswerComment = (questionId, answerId, commentId) =>
  API.delete(`/comments/answer/${questionId}/${answerId}/${commentId}`);

// Bookmarks
export const getBookmarks = () => API.get('/bookmarks/');
export const addBookmark = (questionId) => API.post('/bookmarks/add', { questionId });
export const removeBookmark = (questionId) => API.delete('/bookmarks/remove', { data: { questionId } });
export const addArticleBookmark = (articleId) => API.post('/bookmarks/add-article', { articleId });
export const removeArticleBookmark = (articleId) => API.delete('/bookmarks/remove-article', { data: { articleId } });

// Notifications
export const getNotifications = () => API.get('/notifications/');
export const markNotificationRead = (id) => API.patch(`/notifications/read/${id}`);
export const markAllNotificationsRead = () => API.patch('/notifications/readAll');

// Reputation
export const getUserReputation = (id) => API.get(`/user/reputation/${id}`);
