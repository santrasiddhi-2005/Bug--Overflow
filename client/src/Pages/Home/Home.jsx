import React from "react";
import { useSelector } from "react-redux";

import "../../App.css";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import HomeMainbar from "../../components/HomeMainbar/HomeMainbar";
import { DashboardContent } from "../Dashboard/Dashboard";

const Home = ({ slideIn }) => {
  const currentUser = useSelector((state) => state.currentUserReducer);

  return (
    <div className="home-container-1">
      <LeftSidebar slideIn={slideIn} />
      <div className="home-container-2">
        {currentUser && (
          <div className="home-dashboard-inline">
            <DashboardContent />
          </div>
        )}
        <HomeMainbar />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
