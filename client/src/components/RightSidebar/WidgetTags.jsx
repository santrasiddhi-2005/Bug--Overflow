import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const WidgetTags = () => {
  const questions = useSelector((state) => state.questionsReducer);
  const currentUser = useSelector((state) => state.currentUserReducer);
  const users = useSelector((state) => state.usersReducer);
  
  const userProfile = users.find((u) => u._id === currentUser?.result?._id);
  const watchedTags = userProfile?.tags || [];

  // Calculate popular tags from questions
  const tagCounts = {};
  (questions.data || []).forEach((q) => {
    const tags = Array.isArray(q.questionTags) ? q.questionTags : [];
    tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([tag]) => tag);

  const displayTags = watchedTags.length > 0 ? watchedTags : popularTags;
  const title = watchedTags.length > 0 ? "Watched Tags" : "Popular Tags";

  return (
    <div className="widget-tags">
      <h4>{title}</h4>
      <div className="widget-tags-div">
        {displayTags.map((tag) => (
          <Link to={`/Tags`} key={tag} style={{ textDecoration: "none" }}>
            <p>{tag}</p>
          </Link>
        ))}
        {displayTags.length === 0 && (
          <p style={{ color: "#6a737c", fontSize: "12px" }}>No tags yet</p>
        )}
      </div>
    </div>
  );
};

export default WidgetTags;
