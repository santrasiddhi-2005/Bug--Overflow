import React, { useState } from "react";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";

import Avatar from "../../components/Avatar/Avatar";
import { deleteAnswer, voteAnswer, acceptAnswer, addAnswerComment, deleteAnswerComment } from "../../actions/question";
import { showToast } from "../../utils/toast";
import HtmlWithCopyCode from "../../components/HtmlWithCopyCode/HtmlWithCopyCode";

const DisplayAnswer = ({ question, handleShare }) => {
  const User = useSelector((state) => state.currentUserReducer);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState({});
  const [showCommentForm, setShowCommentForm] = useState({});

  const handleDelete = (answerId, noOfAnswers) => {
    dispatch(deleteAnswer(id, answerId, noOfAnswers - 1));
  };

  const handleUpVote = (answerId) => {
    if (!User) {
      showToast("Login or signup to vote");
      return;
    }
    dispatch(voteAnswer(id, answerId, "upVote"));
  };

  const handleDownVote = (answerId) => {
    if (!User) {
      showToast("Login or signup to vote");
      return;
    }
    dispatch(voteAnswer(id, answerId, "downVote"));
  };

  const handleAcceptAnswer = (answerId) => {
    dispatch(acceptAnswer(id, answerId));
  };

  const handleAddComment = (e, answerId) => {
    e.preventDefault();
    if (!User) {
      showToast("Login to comment");
      return;
    }
    const text = commentText[answerId] || "";
    if (text.trim()) {
      dispatch(addAnswerComment(id, answerId, text.trim(), User.result.name));
      setCommentText(prev => ({ ...prev, [answerId]: "" }));
      setShowCommentForm(prev => ({ ...prev, [answerId]: false }));
    }
  };

  const handleDeleteComment = (answerId, commentId) => {
    dispatch(deleteAnswerComment(id, answerId, commentId));
  };

  // Sort answers: accepted first, then by votes
  const sortedAnswers = [...(question.answer || [])].sort((a, b) => {
    if (a._id === question.acceptedAnswer) return -1;
    if (b._id === question.acceptedAnswer) return 1;
    const aVotes = (a.upVote?.length || 0) - (a.downVote?.length || 0);
    const bVotes = (b.upVote?.length || 0) - (b.downVote?.length || 0);
    return bVotes - aVotes;
  });

  return (
    <div>
      {sortedAnswers.map((ans) => {
        const isAccepted = ans._id === question.acceptedAnswer;
        const voteScore = (ans.upVote?.length || 0) - (ans.downVote?.length || 0);
        return (
          <div
            className={`display-ans ${isAccepted ? "accepted-answer" : ""}`}
            key={ans._id}
            id={`answer-${ans._id}`}
          >
            <div className="answer-content-wrapper">
              <div className="answer-vote-column">
                <FontAwesomeIcon
                  icon={faCaretUp}
                  className={`votes-icon ${
                    (ans.upVote || []).includes(String(User?.result?._id))
                      ? "vote-up-active"
                      : ""
                  }`}
                  onClick={() => handleUpVote(ans._id)}
                  title="Upvote"
                />
                <p className="vote-count">{voteScore}</p>
                <FontAwesomeIcon
                  icon={faCaretDown}
                  className={`votes-icon ${
                    (ans.downVote || []).includes(String(User?.result?._id))
                      ? "vote-down-active"
                      : ""
                  }`}
                  onClick={() => handleDownVote(ans._id)}
                  title="Downvote"
                />
                {isAccepted && (
                  <div className="accepted-checkmark" title="Accepted answer">✓</div>
                )}
                {!isAccepted && User?.result?._id === question?.userId && (
                  <button
                    type="button"
                    className="accept-answer-btn"
                    onClick={() => handleAcceptAnswer(ans._id)}
                    title="Accept this answer"
                  >
                    ✓
                  </button>
                )}
              </div>
              <div className="answer-main-content">
                <HtmlWithCopyCode
                  className="answer-body"
                  html={ans.answerBody}
                />
                <div className="question-actions-user">
                  <div>
                    <button type="button" onClick={handleShare}>Share</button>
                    {User?.result?._id === ans?.userId && (
                      <button
                        type="button"
                        onClick={() => handleDelete(ans._id, question.noOfAnswers)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <div>
                    <p>answered {moment(ans.answeredOn).fromNow()}</p>
                    <Link
                      to={`/Users/${ans.userId}`}
                      className="user-link"
                      style={{ color: "#0086d8" }}
                    >
                      <Avatar
                        seed={ans.userAnswered}
                        px="8px"
                        py="5px"
                        borderRadius="4px"
                      >
                        {ans.userAnswered.charAt(0).toUpperCase()}
                      </Avatar>
                      <div>{ans.userAnswered}</div>
                    </Link>
                  </div>
                </div>
                {/* Comments on this answer */}
                {ans.comments && ans.comments.length > 0 && (
                  <div className="comments-section">
                    {ans.comments.map((comment) => (
                      <div key={comment._id} className="comment-item">
                        <span className="comment-body">{comment.commentBody}</span>
                        <span className="comment-meta">
                          – <Link to={`/Users/${comment.userId}`} style={{color:"#0086d8"}}>{comment.userCommented}</Link>{" "}
                          {moment(comment.commentedOn).fromNow()}
                        </span>
                        {User?.result?._id === comment.userId && (
                          <button
                            type="button"
                            className="comment-delete-btn"
                            onClick={() => handleDeleteComment(ans._id, comment._id)}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="add-comment-section">
                  {showCommentForm[ans._id] ? (
                    <form onSubmit={(e) => handleAddComment(e, ans._id)} className="comment-form">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText[ans._id] || ""}
                        onChange={(e) => setCommentText(prev => ({ ...prev, [ans._id]: e.target.value }))}
                        className="comment-input"
                        maxLength={600}
                      />
                      <button type="submit" className="comment-submit-btn">Add Comment</button>
                      <button type="button" className="comment-cancel-btn" onClick={() => setShowCommentForm(prev => ({ ...prev, [ans._id]: false }))}>Cancel</button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      className="add-comment-btn"
                      onClick={() => setShowCommentForm(prev => ({ ...prev, [ans._id]: true }))}
                    >
                      Add a comment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DisplayAnswer;
