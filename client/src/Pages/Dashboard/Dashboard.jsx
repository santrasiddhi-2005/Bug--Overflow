import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import SummaryCard from "../../components/ProfileCommon/SummaryCard";
import ReputationBadge from "../../components/ProfileCommon/ReputationBadge";
import "./Dashboard.css";

export const DashboardContent = () => {
  const currentUser = useSelector((state) => state.currentUserReducer);
  const users = useSelector((state) => state.usersReducer);
  const questions = useSelector((state) => state.questionsReducer);

  const userProfile = users.find((user) => user._id === currentUser?.result?._id);
  const reputation = userProfile?.reputation || 1;
  const badges = userProfile?.badges || { bronze: [], silver: [], gold: [] };
  const watchedTags = userProfile?.tags || [];
  const userName = currentUser?.result?.name || "there";

  const getGreetingByTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const getGreetingSymbol = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅";
    if (hour < 17) return "☀️";
    if (hour < 21) return "🌇";
    return "🌙";
  };

  const allQuestions = questions.data || [];
  const suggestedQuestions =
    watchedTags.length > 0
      ? allQuestions.filter(
          (question) =>
            Array.isArray(question.questionTags) &&
            question.questionTags.some((tag) => watchedTags.includes(tag))
        )
      : allQuestions.slice(0, 10);

  const myQuestions = allQuestions.filter(
    (question) => question.userId === currentUser?.result?._id
  );

  const myAnswers = allQuestions.filter(
    (question) =>
      Array.isArray(question.answer) &&
      question.answer.some((answer) => answer.userId === currentUser?.result?._id)
  );

  const getRepLevel = (rep) => {
    if (rep >= 200) return { level: "Expert", color: "#FFD700" };
    if (rep >= 50) return { level: "Veteran", color: "#C0C0C0" };
    if (rep >= 10) return { level: "Enthusiast", color: "#CD7F32" };
    return { level: "Newcomer", color: "#6a737c" };
  };

  const repLevel = getRepLevel(reputation);

  if (!currentUser) {
    return (
      <div className="dashboard-login-prompt">
        <h2>Please log in to view your dashboard</h2>
        <Link to="/Auth" className="dashboard-login-btn">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>
          <span className="greeting-symbol" aria-hidden="true">
            {getGreetingSymbol()}
          </span>
          {`${getGreetingByTime()} ${userName}, what do you want to do today?`}
        </h2>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-row-top">
          <SummaryCard title="Reputation" className="dashboard-card reputation-card">
            <div className="reputation-score">
              <span className="rep-number">{reputation}</span>
              <span className="rep-level" style={{ color: repLevel.color }}>
                {repLevel.level}
              </span>
            </div>
            <div className="rep-progress-section">
              <p className="rep-hint">
                {reputation < 10
                  ? `${10 - reputation} more to Enthusiast`
                  : reputation < 50
                  ? `${50 - reputation} more to Veteran`
                  : reputation < 200
                  ? `${200 - reputation} more to Expert`
                  : "Maximum level reached!"}
              </p>
              <div className="rep-progress-bar">
                <div
                  className="rep-progress-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      reputation < 10
                        ? (reputation / 10) * 100
                        : reputation < 50
                        ? ((reputation - 10) / 40) * 100
                        : reputation < 200
                        ? ((reputation - 50) / 150) * 100
                        : 100
                    )}%`,
                    backgroundColor: repLevel.color,
                  }}
                />
              </div>
            </div>
          </SummaryCard>

          <div className="dashboard-card badges-card">
            <h3>Badges</h3>
            <div className="badges-container">
              <ReputationBadge level="gold" count={badges.gold?.length || 0} />
              <ReputationBadge level="silver" count={badges.silver?.length || 0} />
              <ReputationBadge level="bronze" count={badges.bronze?.length || 0} />
            </div>
            {(badges.bronze?.length > 0 || badges.silver?.length > 0 || badges.gold?.length > 0) && (
              <div className="badge-list">
                {badges.gold?.map((badge, index) => (
                  <span key={`g${index}`} className="badge-chip gold">
                    {badge}
                  </span>
                ))}
                {badges.silver?.map((badge, index) => (
                  <span key={`s${index}`} className="badge-chip silver">
                    {badge}
                  </span>
                ))}
                {badges.bronze?.map((badge, index) => (
                  <span key={`b${index}`} className="badge-chip bronze">
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-card stats-card">
            <h3>Activity Summary</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{myQuestions.length}</span>
                <span className="stat-label">Questions</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{myAnswers.length}</span>
                <span className="stat-label">Answers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{watchedTags.length}</span>
                <span className="stat-label">Tags Watched</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{reputation}</span>
                <span className="stat-label">Reputation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Watched Tags</h3>
            <Link to={`/Users/${currentUser?.result?._id}`} className="edit-link">
              Edit
            </Link>
          </div>
          {watchedTags.length === 0 ? (
            <p className="empty-message">
              No watched tags. <Link to={`/Users/${currentUser?.result?._id}`}>Add some tags</Link> to personalize your
              feed.
            </p>
          ) : (
            <div className="tags-display">
              {watchedTags.map((tag) => (
                <span key={tag} className="tag-badge">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Questions for You</h3>
          </div>
          {suggestedQuestions.length === 0 ? (
            <p className="empty-message">No questions found. Try watching some tags!</p>
          ) : (
            <div className="suggested-questions">
              {suggestedQuestions.slice(0, 10).map((question) => (
                <div key={question._id} className="suggested-question-item">
                  <div className="sq-stats">
                    <span
                      className={`sq-answers ${
                        question.noOfAnswers > 0
                          ? question.acceptedAnswer
                            ? "sq-answered"
                            : "sq-has-answers"
                          : ""
                      }`}
                    >
                      {question.noOfAnswers} ans
                    </span>
                    <span className="sq-votes">
                      {(question.upVote?.length || 0) - (question.downVote?.length || 0)} votes
                    </span>
                  </div>
                  <div className="sq-content">
                    <Link to={`/Questions/${question._id}`} className="sq-title">
                      {question.questionTitle}
                    </Link>
                    <div className="sq-tags">
                      {(Array.isArray(question.questionTags) ? question.questionTags : []).slice(0, 3).map((tag) => (
                        <span key={tag} className="tag-badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="sq-time">asked {moment(question.askedOn).fromNow()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>My Recent Questions</h3>
          </div>
          {myQuestions.length === 0 ? (
            <p className="empty-message">You have not asked any questions yet.</p>
          ) : (
            <div className="suggested-questions">
              {myQuestions.slice(0, 5).map((question) => (
                <div key={question._id} className="suggested-question-item">
                  <div className="sq-stats">
                    <span className={`sq-answers ${question.noOfAnswers > 0 ? "sq-has-answers" : ""}`}>
                      {question.noOfAnswers} ans
                    </span>
                  </div>
                  <div className="sq-content">
                    <Link to={`/Questions/${question._id}`} className="sq-title">
                      {question.questionTitle}
                    </Link>
                    <span className="sq-time">{moment(question.askedOn).fromNow()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ slideIn, handleSlideIn }) => {
  return (
    <div className="home-container-1">
      <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
      <div className="home-container-2">
        <DashboardContent />
      </div>
    </div>
  );
};

export default Dashboard;
