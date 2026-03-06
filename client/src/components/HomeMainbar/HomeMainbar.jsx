import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './HomeMainbar.css';
import QuestionList from './QuestionList';
import { showToast } from '../../utils/toast';

const HomeMainbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const questionsList = useSelector((state) => state.questionsReducer);
    const user = useSelector((state) => state.currentUserReducer);

    const checkAuth = () => {
        if (user === null) {
            showToast('Login or signup to ask a question');
            navigate('/Auth');
        } else {
            navigate('/AskQuestion');
        }
    };

    const renderSkeletonCards = (count = 6) =>
        Array.from({ length: count }).map((_, index) => (
            <div className="display-question-container skeleton-card" key={`skeleton-${index}`}>
                <div className="display-stats-column">
                    <div className="display-votes-ans">
                        <span className="skeleton-line skeleton-stat" />
                    </div>
                    <div className="display-votes-ans">
                        <span className="skeleton-line skeleton-stat" />
                    </div>
                    <div className="display-votes-ans">
                        <span className="skeleton-line skeleton-stat" />
                    </div>
                </div>
                <div className="display-question-details">
                    <span className="skeleton-line skeleton-title" />
                    <div className="display-tags-time">
                        <div className="display-tags">
                            <span className="skeleton-line skeleton-tag" />
                            <span className="skeleton-line skeleton-tag" />
                            <span className="skeleton-line skeleton-tag" />
                        </div>
                        <span className="skeleton-line skeleton-time" />
                    </div>
                </div>
            </div>
        ));

    return (
        <div className="main-bar">
            <div className="main-bar-header">
                <div>
                    {location.pathname === '/' ? (
                        <h1 style={{ margin: "4px 0" }}>Interesting posts for you</h1>
                    ) : (
                        <h1 style={{ margin: "4px 0" }}>Newest Questions</h1>
                    )}

                    {location.pathname === '/' && (
                        <h6 style={{ margin: 0, opacity: 0.6 }}>
                            Based on your viewing history and watched tags.
                        </h6>
                    )}
                </div>
                <button onClick={checkAuth} className="ask-btn">
                    Ask Question
                </button>
            </div>
            <div>
                {questionsList.data === null ? (
                    <div className="skeleton-list">{renderSkeletonCards()}</div>
                ) : (
                    <>
                        <p>{questionsList.data.length} questions</p>
                        <QuestionList questionsList={questionsList.data} />
                    </>
                )}
            </div>
        </div>
    );
};

export default HomeMainbar;
