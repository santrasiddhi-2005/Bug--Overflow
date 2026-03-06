import React from "react";

const SummaryCard = ({ title, value, subtitle, children, className = "" }) => {
  return (
    <div className={`summary-card ${className}`.trim()}>
      <h4>{title}</h4>
      {value !== undefined && <p className="summary-big-number">{value}</p>}
      {subtitle && <p className="summary-muted">{subtitle}</p>}
      {children}
    </div>
  );
};

export default SummaryCard;
