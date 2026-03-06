import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const Questions = ({ question }) => {
  return (
    <div className="display-question-container">
      <div className="display-stats-column">
        <div className="display-votes-ans">
          <p className="stats-value">{question.upVote.length - question.downVote.length}</p>
          <p className="stats-label">votes</p>
        </div>
        <div className={`display-votes-ans ${question.noOfAnswers > 0 ? "has-answers" : ""}`}>
          <p className="stats-value">{question.noOfAnswers}</p>
          <p className="stats-label">answers</p>
        </div>
        <div className="display-votes-ans">
          <p className="stats-value">{question.views || 0}</p>
          <p className="stats-label">views</p>
        </div>
      </div>
      <div className="display-question-details">
        <Link to={`/Questions/${question._id}`} className="question-title-link">
          {question.questionTitle.length > (window.innerWidth <= 400 ? 70 : 90)
            ? question.questionTitle.substring(
                0,
                window.innerWidth <= 400 ? 70 : 90
              ) + "..."
            : question.questionTitle}
        </Link>
        <div className="display-tags-time">
          <div className="display-tags">
            {(Array.isArray(question.questionTags)
              ? question.questionTags
              : question.questionTags.toString().split(" ")
            ).map((tag) => (
              <span key={tag} className="tag-badge">
                {tag}
              </span>
            ))}
          </div>
          <p className="display-time">
            asked {moment(question.askedOn).fromNow()} {question.userPosted}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Questions;
