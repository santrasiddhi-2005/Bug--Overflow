import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home/Home";
import Auth from "./Pages/Auth/Auth";
import Questions from "./Pages/Questions/Questions";
import AskQuestion from "./Pages/AskQuestion/AskQuestion";
import DisplayQuestion from "./Pages/Questions/DisplayQuestion";
import Tags from "./Pages/Tags/Tags";
import Users from "./Pages/Users/Users";
import UserProfile from "./Pages/UserProfile/UserProfile";
import SearchPage from "./Pages/Search/Search";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Bookmarks from "./Pages/Bookmarks/Bookmarks";
import Articles from "./Pages/Articles/Articles";
import ArticleDetails from "./Pages/Articles/ArticleDetails";
import ArticleEditor from "./Pages/Articles/ArticleEditor";
import About from "./Pages/About/About";

const AllRoutes = ({ slideIn, handleSlideIn }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home slideIn={slideIn} handleSlideIn={handleSlideIn} />}
      />
      <Route path="/Auth" element={<Auth />} />
      <Route path="/AskQuestion" element={<AskQuestion />} />
      <Route path="/Search" element={<SearchPage />} />
      <Route
        path="/Questions"
        element={<Questions slideIn={slideIn} handleSlideIn={handleSlideIn} />}
      />
      <Route
        path="/Questions/:id"
        element={
          <DisplayQuestion slideIn={slideIn} handleSlideIn={handleSlideIn} />
        }
      />
      <Route
        path="/Tags"
        element={<Tags slideIn={slideIn} handleSlideIn={handleSlideIn} />}
      />
      <Route
        path="/Users"
        element={<Users slideIn={slideIn} handleSlideIn={handleSlideIn} />}
      />
      <Route
        path="/Users/:id"
        element={
          <UserProfile slideIn={slideIn} handleSlideIn={handleSlideIn} />
        }
      />
      <Route
        path="/Dashboard"
        element={<Dashboard slideIn={slideIn} handleSlideIn={handleSlideIn} />}
      />
      <Route
        path="/Bookmarks"
        element={<Bookmarks slideIn={slideIn} handleSlideIn={handleSlideIn} />}
      />
      <Route
        path="/Articles"
        element={<Articles slideIn={slideIn} handleSlideIn={handleSlideIn} />}
      />
      <Route
        path="/Articles/new"
        element={<ArticleEditor slideIn={slideIn} handleSlideIn={handleSlideIn} />}
      />
      <Route
        path="/Articles/edit/:id"
        element={<ArticleEditor slideIn={slideIn} handleSlideIn={handleSlideIn} />}
      />
      <Route
        path="/Articles/:id"
        element={<ArticleDetails slideIn={slideIn} handleSlideIn={handleSlideIn} />}
      />
      <Route
        path="/About"
        element={<About slideIn={slideIn} handleSlideIn={handleSlideIn} />}
      />
    </Routes>
  );
};

export default AllRoutes;
