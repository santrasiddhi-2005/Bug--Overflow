import React, { useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import copy from "copy-to-clipboard";

import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import { deleteArticle } from "../../actions/articles";
import { fetchBookmarks, toggleArticleBookmark } from "../../actions/bookmarks";
import { showToast } from "../../utils/toast";
import { getArticleById } from "../../api";
import "./Articles.css";

const ArticleDetails = ({ slideIn, handleSlideIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.currentUserReducer);
  const articles = useSelector((state) => state.articlesReducer?.data);
  const bookmarks = useSelector((state) => state.bookmarksReducer);
  const [dbArticle, setDbArticle] = React.useState(null);
  const [isLoadingArticle, setIsLoadingArticle] = React.useState(false);

  const article = useMemo(() => (articles || []).find((item) => item._id === id), [articles, id]);

  React.useEffect(() => {
    if (user?.token) {
      dispatch(fetchBookmarks());
    }
  }, [dispatch, user]);

  React.useEffect(() => {
    const loadArticle = async () => {
      if (article) {
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
  }, [article, id]);

  const resolvedArticle = article || dbArticle;

  const handleShare = () => {
    copy(`http://localhost:3000${location.pathname}`);
    showToast("Copied url", "success");
  };

  const handleBookmark = () => {
    if (!user) {
      showToast("Login to bookmark articles");
      return;
    }
    const isBookmarked = (bookmarks.articles || []).some((a) => a._id === id);
    dispatch(toggleArticleBookmark(id, isBookmarked));
  };

  const handleDelete = () => {
    dispatch(deleteArticle(id, navigate));
  };

  if (articles === null || isLoadingArticle) {
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

  if (!resolvedArticle) {
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

  const isOwner = String(user?.result?._id) === String(resolvedArticle.userId);
  const isBookmarked = (bookmarks.articles || []).some((a) => a._id === id);

  return (
    <div className="home-container-1">
      <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
      <div className="home-container-2">
        <article className="articles-page">
          <h1>{resolvedArticle.articleTitle}</h1>
          <p className="article-meta-text">
            by <Link to={`/Users/${resolvedArticle.userId}`}>{resolvedArticle.userPosted}</Link> • {moment(resolvedArticle.createdAt).fromNow()}
          </p>

          <div className="bookmark-tags" style={{ marginBottom: "14px" }}>
            {(Array.isArray(resolvedArticle.articleTags) ? resolvedArticle.articleTags : []).map((tag) => (
              <span className="tag-badge" key={tag}>{tag}</span>
            ))}
          </div>

          <div className="article-actions" style={{ marginBottom: "14px" }}>
            <div>
              <button type="button" onClick={handleShare}>Share</button>
              <button type="button" onClick={handleBookmark}>
                {isBookmarked ? "Remove Bookmark" : "Bookmark"}
              </button>
              {isOwner && (
                <>
                  <button type="button" onClick={() => navigate(`/Articles/edit/${resolvedArticle._id}`)}>Edit</button>
                  <button type="button" onClick={handleDelete}>Delete</button>
                </>
              )}
            </div>
          </div>

          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: resolvedArticle.articleBody }}
          />
        </article>
      </div>
    </div>
  );
};

export default ArticleDetails;
