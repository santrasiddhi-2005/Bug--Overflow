import React from "react";
import "./RightSidebar.css";
import WidgetTags from "./WidgetTags";
import PopularQuestions from "./PopularQuestions";

const RightSidebar = () => {
  return (
    <aside className="right-sidebar">
      <PopularQuestions />
      <WidgetTags />
    </aside>
  );
};

export default RightSidebar;
