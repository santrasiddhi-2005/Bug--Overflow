import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const PopularQuestions = () => {
  const questions = useSelector((state) => state.questionsReducer);
  
  const popular = [...(questions.data || [])]
    .sort((a, b) => {
      const aScore = (a.upVote?.length || 0) - (a.downVote?.length || 0) + (a.views || 0) * 0.1;
      const bScore = (b.upVote?.length || 0) - (b.downVote?.length || 0) + (b.views || 0) * 0.1;
      return bScore - aScore;
    })
    .slice(0, 5);

  if (popular.length === 0) return null;

  return (
    <div className="widget">
      <h4>Hot Questions</h4>
      <div className="right-sidebar-div-1">
        {popular.map((q) => (
          <div key={q._id} className="right-sidebar-div-2">
            <p style={{ minWidth: "20px", textAlign: "center" }}>
              {(q.upVote?.length || 0) - (q.downVote?.length || 0)}
            </p>
            <Link
              to={`/Questions/${q._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <p>
                {q.questionTitle.length > 60
                  ? q.questionTitle.substring(0, 60) + "..."
                  : q.questionTitle}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularQuestions;
