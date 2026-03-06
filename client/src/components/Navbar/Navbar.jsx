import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import decode from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faBell,
  faRightToBracket,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import logo from "../../assets/bugOverflow.png";
import Avatar from "../../components/Avatar/Avatar";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./Navbar.css";
import { setCurrentUser } from "../../actions/currentUser";
import bars from "../../assets/bars-solid.svg";
import { fetchNotifications, markAllNotificationsRead } from "../../actions/notifications";

const NOTIFICATION_POLL_INTERVAL = 30000;

const Navbar = ({ handleSlideIn, darkMode, setDarkMode }) => {
  const dispatch = useDispatch();
  var User = useSelector((state) => state.currentUserReducer);
  const notifications = useSelector((state) => state.notificationsReducer);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    dispatch(setCurrentUser(null));
  };

  useEffect(() => {
    const token = User?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
    }
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
  }, [User?.token, dispatch]);

  // Poll for notifications every 30 seconds when logged in
  useEffect(() => {
    if (User?.token) {
      dispatch(fetchNotifications());
      const interval = setInterval(() => {
        dispatch(fetchNotifications());
      }, NOTIFICATION_POLL_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [User?.token, dispatch]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && notifications.unreadCount > 0) {
      dispatch(markAllNotificationsRead());
    }
  };

  return (
    <nav className="main-nav">
      <div className="navbar">
        {User?.token && <button className="slide-in-icon" onClick={() => handleSlideIn()}>
          <img src={bars} alt="bars" style={{borderRadius: 5}} width="15" />
        </button>}
        <div className="navbar-1">
          <Link to="/" className="nav-item nav-logo">
            <img src={logo} height={40} alt="logo" />
          </Link>
          <Link to="/About" className="nav-item nav-btn res-nav">
            About
          </Link>
          <SearchBar />
        </div>
        <div className="navbar-2">
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode && setDarkMode(!darkMode)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          {User === null ? (
            <Link to="/Auth" className="nav-item nav-links nav-icon-link" title="Log in">
              <FontAwesomeIcon icon={faRightToBracket} className="nav-action-icon" />
              <span>Log in</span>
            </Link>
          ) : (
            <>
              <div className="notification-container">
                <button
                  className="notification-btn"
                  onClick={handleNotificationClick}
                  title="Notifications"
                >
                  <FontAwesomeIcon icon={faBell} />
                  {notifications.unreadCount > 0 && (
                    <span className="notification-badge">
                      {notifications.unreadCount > 9 ? "9+" : notifications.unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h4>Notifications</h4>
                    </div>
                    {notifications.data.length === 0 ? (
                      <p className="no-notifications">No notifications</p>
                    ) : (
                      <div className="notification-list">
                        {notifications.data.slice(0, 10).map((notif) => (
                          <div
                            key={notif._id}
                            className={`notification-item ${!notif.read ? "unread" : ""}`}
                            onClick={() => {
                              if (notif.link) navigate(notif.link);
                              setShowNotifications(false);
                            }}
                          >
                            <p>{notif.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Link
                to={`/Users/${User?.result?._id}`}
                style={{ color: "white", textDecoration: "none", padding: "10px" }}
              >
                <Avatar
                  seed={User.result.name}
                  px="12px"
                  py="7px"
                  borderRadius="50%"
                  color="white"
                >
                    {User.result.name.charAt(0).toUpperCase()}
                </Avatar>
              </Link>
              <button className="nav-item nav-links" style={{marginLeft: 10}} onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} className="nav-action-icon" />
                <span>Log out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
