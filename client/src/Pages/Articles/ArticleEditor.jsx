import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import TextEditor from "../../components/TextEditor/TextEditor";
import { createArticle as createArticleAction, updateArticle as updateArticleAction } from "../../actions/articles";
import { showToast } from "../../utils/toast";
import { getArticleById } from "../../api";
import "../AskQuestion/AskQuestion.css";

const toTagArray = (value) =>
  value
    .split(" ")
    .map((tag) => tag.trim())
    .filter((tag) => tag);

const ArticleEditor = ({ slideIn, handleSlideIn }) => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.currentUserReducer);
  const articles = useSelector((state) => state.articlesReducer?.data);
  const storeArticle = useMemo(() => (articles || []).find((item) => item._id === id), [articles, id]);
  const [dbArticle, setDbArticle] = useState(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);

  React.useEffect(() => {
    const loadArticle = async () => {
      if (!isEditMode || storeArticle) {
        setDbArticle(null);
        return;
      }
      setIsLoadingArticle(true);
      try {
        const { data } = await getArticleById(id);
        setDbArticle(data);
      } catch (error) {
        setDbArticle(null);
      } finally {
        setIsLoadingArticle(false);
      }
    };

    loadArticle();
  }, [id, isEditMode, storeArticle]);

  const editingArticle = storeArticle || dbArticle;

  const [articleTitle, setArticleTitle] = useState(editingArticle?.articleTitle || "");
  const [articleBody, setArticleBody] = useState(editingArticle?.articleBody || "");
  const [articleTags, setArticleTags] = useState((editingArticle?.articleTags || []).join(" "));

  React.useEffect(() => {
    if (isEditMode && editingArticle) {
      setArticleTitle(editingArticle.articleTitle || "");
      setArticleBody(editingArticle.articleBody || "");
      setArticleTags((editingArticle.articleTags || []).join(" "));
    }
  }, [editingArticle, isEditMode]);

  const handleTagsKeyDown = (e) => {
    if (e.key === " " || e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      const currentValue = e.target.value.trim();
      if (currentValue) {
        setArticleTags((prev) => prev + (prev ? " " : "") + currentValue);
        e.target.value = "";
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      showToast("Login to write an article");
      navigate("/Auth");
      return;
    }

    const plainTextBody = articleBody.replace(/<[^>]*>/g, "").trim();
    const tagsArray = toTagArray(articleTags);

    if (!articleTitle.trim() || !plainTextBody) {
      showToast("Please enter title and body");
      return;
    }

    const payload = {
      articleTitle: articleTitle.trim(),
      articleBody,
      articleTags: tagsArray,
      userPosted: user.result.name,
    };

    if (isEditMode) {
      if (String(editingArticle?.userId) !== String(user.result._id)) {
        showToast("You can only edit your own article");
        return;
      }
      dispatch(updateArticleAction(id, payload, navigate));
      return;
    }

    dispatch(createArticleAction(payload, navigate));
  };

  if (isEditMode && (articles === null || isLoadingArticle)) {
    return (
      <div className="home-container-1">
        <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
        <div className="home-container-2">
          <div className="bookmarks-empty">
            <h3>Loading...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (isEditMode && !editingArticle) {
    return (
      <div className="home-container-1">
        <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
        <div className="home-container-2">
          <div className="bookmarks-empty">
            <h3>Article not found</h3>
            <Link to="/Articles" className="browse-questions-btn">Back to Articles</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container-1">
      <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
      <div className="home-container-2">
        <div className="ask-question">
          <div className="ask-ques-container">
            <h1>{isEditMode ? "Edit Article" : "Write an Article"}</h1>
            <form onSubmit={handleSubmit}>
              <div className="ask-form-container">
                <label htmlFor="article-title">
                  <h4>Title</h4>
                  <p>Write a clear, concise title for your article</p>
                  <input
                    type="text"
                    id="article-title"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    placeholder="e.g. Building reusable React hooks"
                  />
                </label>

                <div className="ask-ques-body-container">
                  <h4>Body</h4>
                  <p>Share your article content in detail</p>
                  <TextEditor
                    value={articleBody}
                    onChange={setArticleBody}
                    placeholder="Write your article content..."
                  />
                </div>

                <label htmlFor="article-tags">
                  <h4>Tags</h4>
                  <p>Add relevant tags (Space, Tab, or Enter to add)</p>
                  <div className="tags-input-container">
                    <input
                      type="text"
                      id="article-tags"
                      onKeyDown={handleTagsKeyDown}
                      placeholder="e.g. react nodejs backend"
                    />
                    {articleTags && (
                      <div className="tags-display">
                        {toTagArray(articleTags).map((tag, index) => (
                          <span key={`${tag}-${index}`} className="tag-chip">
                            {tag}
                            <button
                              type="button"
                              onClick={() => {
                                const tags = toTagArray(articleTags);
                                tags.splice(index, 1);
                                setArticleTags(tags.join(" "));
                              }}
                              className="tag-remove"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <input
                type="submit"
                value={isEditMode ? "Update Article" : "Publish Article"}
                className="review-btn"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
