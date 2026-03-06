import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import { fetchBookmarks, toggleBookmark, toggleArticleBookmark } from "../../actions/bookmarks";
import "./Bookmarks.css";

const Bookmarks = ({ slideIn, handleSlideIn }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUserReducer);
  const bookmarks = useSelector((state) => state.bookmarksReducer);

  useEffect(() => {
    if (currentUser?.token) {
      dispatch(fetchBookmarks());
    }
  }, [currentUser, dispatch]);

  if (!currentUser) {
    return (
      <div className="home-container-1">
        <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
        <div className="home-container-2">
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <h2>Please log in to view your bookmarks</h2>
            <Link to="/Auth" style={{ color: "#0a95ff" }}>Log in</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container-1">
      <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
      <div className="home-container-2">
        <div className="bookmarks-page">
          <div className="bookmarks-header">
            <h1>Bookmarks</h1>
            <p>{(bookmarks.questions || []).length} questions • {(bookmarks.articles || []).length} articles</p>
          </div>
          <div className="bookmark-section">
            <h2>Questions</h2>
            {(bookmarks.questions || []).length === 0 ? (
              <div className="bookmarks-empty bookmarks-empty-inline">
                <p>No saved questions yet.</p>
                <Link to="/Questions" className="browse-questions-btn">Browse Questions</Link>
              </div>
            ) : (
              <div className="bookmarks-list">
                {(bookmarks.questions || []).map((question) => (
                  <div key={question._id} className="bookmark-item">
                    <div className="bookmark-stats">
                      <div className="bm-stat">
                        <span className="bm-number">{(question.upVote?.length || 0) - (question.downVote?.length || 0)}</span>
                        <span className="bm-label">votes</span>
                      </div>
                      <div className={`bm-stat ${question.noOfAnswers > 0 ? "bm-answered" : ""}`}>
                        <span className="bm-number">{question.noOfAnswers}</span>
                        <span className="bm-label">answers</span>
                      </div>
                      <div className="bm-stat">
                        <span className="bm-number">{question.views || 0}</span>
                        <span className="bm-label">views</span>
                      </div>
                    </div>
                    <div className="bookmark-content">
                      <Link to={`/Questions/${question._id}`} className="bookmark-title">
                        {question.questionTitle}
                      </Link>
                      <div className="bookmark-meta">
                        <div className="bookmark-tags">
                          {(Array.isArray(question.questionTags) ? question.questionTags : []).map((tag) => (
                            <span key={tag} className="tag-badge">{tag}</span>
                          ))}
                        </div>
                        <span className="bookmark-time">asked {moment(question.askedOn).fromNow()}</span>
                      </div>
                    </div>
                    <button
                      className="remove-bookmark-btn"
                      onClick={() => dispatch(toggleBookmark(question._id, true))}
                      title="Remove bookmark"
                    >
                      🔖
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bookmark-section">
            <h2>Articles</h2>
            {(bookmarks.articles || []).length === 0 ? (
              <div className="bookmarks-empty bookmarks-empty-inline">
                <p>No saved articles yet.</p>
                <Link to="/Articles" className="browse-questions-btn">Browse Articles</Link>
              </div>
            ) : (
              <div className="bookmarks-list">
                {(bookmarks.articles || []).map((article) => (
                  <div key={article._id} className="bookmark-item">
                    <div className="bookmark-content">
                      <Link to={`/Articles/${article._id}`} className="bookmark-title">
                        {article.articleTitle}
                      </Link>
                      <div className="bookmark-meta">
                        <div className="bookmark-tags">
                          {(Array.isArray(article.articleTags) ? article.articleTags : []).map((tag) => (
                            <span key={tag} className="tag-badge">{tag}</span>
                          ))}
                        </div>
                        <span className="bookmark-time">published {moment(article.createdAt).fromNow()}</span>
                      </div>
                    </div>
                    <button
                      className="remove-bookmark-btn"
                      onClick={() => dispatch(toggleArticleBookmark(article._id, true))}
                      title="Remove bookmark"
                    >
                      🔖
                    </button>
                  </div>
                ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
