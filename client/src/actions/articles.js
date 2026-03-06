import * as api from "../api";

export const fetchAllArticles = () => async (dispatch) => {
  try {
    const { data } = await api.getAllArticles();
    dispatch({ type: "FETCH_ALL_ARTICLES", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createArticle = (articleData, navigate) => async (dispatch) => {
  try {
    await api.createArticle(articleData);
    dispatch(fetchAllArticles());
    navigate("/Articles");
  } catch (error) {
    console.log(error);
  }
};

export const updateArticle = (id, articleData, navigate) => async (dispatch) => {
  try {
    await api.updateArticle(id, articleData);
    dispatch(fetchAllArticles());
    navigate(`/Articles/${id}`);
  } catch (error) {
    console.log(error);
  }
};

export const deleteArticle = (id, navigate) => async (dispatch) => {
  try {
    await api.deleteArticle(id);
    dispatch(fetchAllArticles());
    navigate("/Articles");
  } catch (error) {
    console.log(error);
  }
};
