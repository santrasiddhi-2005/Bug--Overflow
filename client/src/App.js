import { BrowserRouter as Router } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AllRoutes from "./AllRoutes";
import ToastContainer from "./components/Toast/ToastContainer";
import { fetchAllQuestions } from "./actions/question";
import { fetchAllUsers } from "./actions/users";
import { fetchNotifications } from "./actions/notifications";
import { fetchAllArticles } from "./actions/articles";

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUserReducer);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    dispatch(fetchAllQuestions());
    dispatch(fetchAllUsers());
    dispatch(fetchAllArticles());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser?.token) {
      dispatch(fetchNotifications());
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const [slideIn, setSlideIn] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= 760) {
      setSlideIn(false);
    }
  }, []);

  const handleSlideIn = () => {
    if (window.innerWidth <= 760) {
      setSlideIn((state) => !state);
    }
  };

  return (
    <div className={`App${darkMode ? " dark-mode" : ""}`}>
      <Router>
        <Navbar handleSlideIn={handleSlideIn} darkMode={darkMode} setDarkMode={setDarkMode} />
        <AllRoutes slideIn={slideIn} handleSlideIn={handleSlideIn} />
        <Footer />
        <ToastContainer />
      </Router>
    </div>
  );
}

export default App;
