import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import { showToast } from "../../utils/toast";
import "./Articles.css";

const Articles = ({ slideIn, handleSlideIn }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentUserReducer);
  const articles = useSelector((state) => state.articlesReducer?.data || []);

  const checkAuth = () => {
    if (!user) {
      showToast("Login or signup to write an article");
      navigate("/Auth");
      return;
    }
    navigate("/Articles/new");
  };

  return (
    <div className="home-container-1">
      <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
      <div className="home-container-2">
        <div className="articles-page">
          <div className="articles-header">
            <h1>Articles</h1>
            <button type="button" className="ask-btn" onClick={checkAuth}>
              Write Article
            </button>
          </div>

          {articles.length === 0 ? (
            <div className="bookmarks-empty">
              <h3>No articles yet</h3>
              <p>Be the first one to publish an article.</p>
            </div>
          ) : (
            <div className="articles-list">
              {articles.map((article) => (
                <div className="article-card" key={article._id}>
                  <Link to={`/Articles/${article._id}`} className="bookmark-title">
                    {article.articleTitle}
                  </Link>
                  <div className="bookmark-tags">
                    {(Array.isArray(article.articleTags) ? article.articleTags : []).map((tag) => (
                      <span className="tag-badge" key={tag}>{tag}</span>
                    ))}
                  </div>
                  <p className="article-meta-text">
                    by <Link to={`/Users/${article.userId}`}>{article.userPosted}</Link> • {moment(article.createdAt).fromNow()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;
