import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward } from "@fortawesome/free-solid-svg-icons";

const ReputationBadge = ({ level, count }) => {
  const colors = { bronze: "#CD7F32", silver: "#C0C0C0", gold: "#FFD700" };
  return (
    <div className="rep-badge">
      <span className="badge-dot" style={{ color: colors[level] }}>
        <FontAwesomeIcon icon={faAward} />
      </span>
      <span className="badge-level">{level}</span>
      <span className="badge-count">{count}</span>
    </div>
  );
};

export default ReputationBadge;
