import * as api from "../api";

export const fetchBookmarks = () => async (dispatch) => {
  try {
    const { data } = await api.getBookmarks();
    dispatch({ type: "FETCH_BOOKMARKS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const toggleBookmark = (questionId, isBookmarked) => async (dispatch) => {
  try {
    if (isBookmarked) {
      await api.removeBookmark(questionId);
    } else {
      await api.addBookmark(questionId);
    }
    dispatch(fetchBookmarks());
  } catch (error) {
    console.log(error);
  }
};

export const toggleArticleBookmark = (articleId, isBookmarked) => async (dispatch) => {
  try {
    if (isBookmarked) {
      await api.removeArticleBookmark(articleId);
    } else {
      await api.addArticleBookmark(articleId);
    }
    dispatch(fetchBookmarks());
  } catch (error) {
    console.log(error);
  }
};
