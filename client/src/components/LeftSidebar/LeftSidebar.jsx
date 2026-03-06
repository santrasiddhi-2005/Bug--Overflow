import React from 'react';
import './LeftSidebar.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHouse,
    faCircleQuestion,
    faTag,
    faUsers,
    faBookmark,
    faNewspaper,
    faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';

const LeftSidebar = ({ slideIn, handleSlideIn }) => {
    const slideInStyle = {
        transform: 'translateX(0%)',
    };

    const slideOutStyle = {
        transform: 'translateX(-100%)',
    };

    return (
        <div className="left-sidebar" style={slideIn ? slideInStyle : slideOutStyle}>
            <nav className="side-nav">
                <button onClick={() => handleSlideIn()} className="nav-btn">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `side-nav-links ${isActive ? 'active' : ''}`}
                    >
                        <FontAwesomeIcon icon={faHouse} className="side-nav-icon" />
                        <span className="side-nav-text">Home</span>
                    </NavLink>
                    <button onClick={() => handleSlideIn()} className="nav-btn">
                        <NavLink
                            to="/Questions"
                            className={({ isActive }) =>
                                `side-nav-links ${isActive ? 'active' : ''}`
                            }
                        >
                            <FontAwesomeIcon icon={faCircleQuestion} className="side-nav-icon" />
                            <span className="side-nav-text">Questions</span>
                        </NavLink>
                    </button>
                    <button onClick={() => handleSlideIn()} className="nav-btn">
                        <NavLink
                            to="/Tags"
                            className={({ isActive }) =>
                                `side-nav-links ${isActive ? 'active' : ''}`
                            }
                        >
                            <FontAwesomeIcon icon={faTag} className="side-nav-icon" />
                            <span className="side-nav-text">Tags</span>
                        </NavLink>
                    </button>
                </button>
                <button onClick={() => handleSlideIn()} className="nav-btn">
                    <NavLink
                        to="/Bookmarks"
                        className={({ isActive }) => `side-nav-links ${isActive ? 'active' : ''}`}
                    >
                        <FontAwesomeIcon icon={faBookmark} className="side-nav-icon" />
                        <span className="side-nav-text">Saves</span>
                    </NavLink>
                </button>

                <div className="side-nav-div">
                    <button onClick={() => handleSlideIn()} className="nav-btn">
                        <NavLink
                            to="/Articles"
                            className={({ isActive }) =>
                                `side-nav-links ${isActive ? 'active' : ''}`
                            }
                        >
                            <FontAwesomeIcon icon={faNewspaper} className="side-nav-icon" />
                            <span className="side-nav-text">Articles</span>
                        </NavLink>
                    </button>
                    <button onClick={() => handleSlideIn()} className="nav-btn">
                        <NavLink
                            to="/Users"
                            className={({ isActive }) =>
                                `side-nav-links ${isActive ? 'active' : ''}`
                            }
                        >
                            <FontAwesomeIcon icon={faUsers} className="side-nav-icon" />
                            <span className="side-nav-text">Users</span>
                        </NavLink>
                    </button>
                    <button onClick={() => handleSlideIn()} className="nav-btn">
                        <NavLink
                            to="/About"
                            className={({ isActive }) =>
                                `side-nav-links ${isActive ? 'active' : ''}`
                            }
                        >
                            <FontAwesomeIcon icon={faCircleInfo} className="side-nav-icon" />
                            <span className="side-nav-text">About</span>
                        </NavLink>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default LeftSidebar;
