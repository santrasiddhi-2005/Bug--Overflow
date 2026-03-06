import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCakeCandles,
  faLocationDot,
  faClock,
  faLink,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import Avatar from "../../components/Avatar/Avatar";
import SummaryCard from "../../components/ProfileCommon/SummaryCard";
import BadgeInlineStats from "../../components/ProfileCommon/BadgeInlineStats";
import EditProfileForm from "./EditProfileForm";
import "./UsersProfile.css";
import ReputationBadge from "../../components/ProfileCommon/ReputationBadge";

const UserProfile = ({ slideIn, handleSlideIn }) => {
  const { id } = useParams();
  const users = useSelector((state) => state.usersReducer);
  const currentUser = useSelector((state) => state.currentUserReducer);
  const currentProfile = users.filter((user) => user._id === id)[0];
  const allQuestions = useSelector((state) => state.questionsReducer?.data || []);
  const allArticles = useSelector((state) => state.articlesReducer?.data || []);
  const [activeTab, setActiveTab] = useState("Summary");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const isOwnProfile = String(currentUser?.result?._id) === String(id);

  const myQuestions = useMemo(
    () => allQuestions.filter((q) => q.userId === id),
    [allQuestions, id]
  );
  
  const myAnswers = useMemo(
    () =>
      allQuestions
        .flatMap((q) =>
          (q.answer || [])
            .filter((a) => a.userId === id)
            .map((a) => ({
              _id: a._id,
              questionId: q._id,
              questionTitle: q.questionTitle,
              answeredOn: a.answeredOn,
              score: (a.upVote?.length || 0) - (a.downVote?.length || 0),
            }))
        )
        .sort((a, b) => new Date(b.answeredOn) - new Date(a.answeredOn)),
    [allQuestions, id]
  );

  const answeredQuestions = useMemo(() => {
    const uniqueByQuestion = new Map();
    myAnswers.forEach((ans) => {
      if (!uniqueByQuestion.has(ans.questionId)) {
        uniqueByQuestion.set(ans.questionId, ans);
      }
    });
    return Array.from(uniqueByQuestion.values());
  }, [myAnswers]);

  const myArticles = useMemo(
    () => allArticles.filter((article) => article.userId === id),
    [allArticles, id]
  );


  const tagStats = useMemo(() => {
    const tagsCount = {};
    myQuestions.forEach((q) => {
      (Array.isArray(q.questionTags) ? q.questionTags : []).forEach((tag) => {
        tagsCount[tag] = (tagsCount[tag] || 0) + 1;
      });
    });
    return Object.entries(tagsCount).sort((a, b) => b[1] - a[1]);
  }, [myQuestions]);

  const reputation = currentProfile?.reputation || 1;
  const badges = currentProfile?.badges || { bronze: [], silver: [], gold: [] };
  const totalBadges =
    (badges.bronze?.length || 0) +
    (badges.silver?.length || 0) +
    (badges.gold?.length || 0);
  const peopleReached = myQuestions.reduce((sum, q) => sum + (q.views || 0), 0);

  return (
      <div className="home-container-1">
          <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
          <div className="home-container-2">
              <section className="profile-shell">
                  <div className="user-details-container profile-top-header">
                      <div className="user-details">
                          <Avatar
                              seed={currentProfile?.name}
                              color="white"
                              fontSize="36px"
                              px="28px"
                              py="18px"
                          >
                              {currentProfile?.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <div className="user-name">
                              <h1>{currentProfile?.name}</h1>
                              <h3>{currentProfile?.about || 'Member of this community'}</h3>
                              <div className="profile-stats">
                                  <p>
                                      <FontAwesomeIcon icon={faCakeCandles} /> Member for{' '}
                                      {moment(currentProfile?.joinedOn).fromNow()}
                                  </p>
                                  <p>
                                      <FontAwesomeIcon icon={faLocationDot} />{' '}
                                      {currentProfile?.location || 'India'}
                                  </p>
                                  <p>
                                      <FontAwesomeIcon icon={faClock} /> Last seen{' '}
                                      {moment(
                                          currentProfile?.lastSeen || currentProfile?.joinedOn,
                                      ).fromNow()}
                                  </p>
                              </div>
                          </div>
                      </div>
                      {isOwnProfile && !showEditProfile && (
                          <button
                              type="button"
                              className="edit-profile-btn"
                              onClick={() => setShowEditProfile(true)}
                          >
                              <FontAwesomeIcon icon={faPenToSquare} /> Edit profile
                          </button>
                      )}
                  </div>

                  {showEditProfile ? (
                      <div className="profile-edit-wrap">
                          <EditProfileForm
                              currentUser={currentUser}
                              currentProfile={currentProfile}
                              setSwitch={setShowEditProfile}
                          />
                      </div>
                  ) : (
                      <div className="profile-layout">
                          <aside className="profile-left-nav">
                              <h4>Profile</h4>
                              <ul>
                                  {[
                                      'Summary',
                                      'Answers',
                                      'Questions',
                                      'Tags',
                                      'Articles',
                                      'Badges',
                                      'Reputation',
                                  ].map((tab) => (
                                      <li key={tab} className={activeTab === tab ? 'active' : ''}>
                                          <button
                                              type="button"
                                              className="profile-tab-btn"
                                              onClick={() => setActiveTab(tab)}
                                          >
                                              {tab}
                                          </button>
                                      </li>
                                  ))}
                              </ul>
                          </aside>

                          <div className="profile-main-content">
                              <h2 className="section-title">{activeTab}</h2>

                              {activeTab === 'Summary' && (
                                  <>
                                      <div className="summary-cards-grid">
                                          <SummaryCard
                                              title="Reputation"
                                              value={reputation}
                                              subtitle="Reputation is how the community thanks you."
                                          />
                                          <SummaryCard title="Badges">
                                              <BadgeInlineStats badges={badges} />
                                          </SummaryCard>
                                          <SummaryCard
                                              title="Impact"
                                              value={peopleReached}
                                              subtitle="people reached"
                                          />
                                      </div>

                                      <div className="profile-section-grid">
                                          <div className="profile-box">
                                              <div className="box-header">
                                                  <h3>Profile Info</h3>
                                              </div>
                                              <div className="list-row">
                                                  <span className="pill">
                                                      <FontAwesomeIcon icon={faLocationDot} />
                                                  </span>
                                                  <span className="list-link">
                                                      {currentProfile?.location || 'India'}
                                                  </span>
                                              </div>
                                              <div className="list-row">
                                                  <span className="pill">
                                                      <FontAwesomeIcon icon={faClock} />
                                                  </span>
                                                  <span className="list-link">
                                                      Last seen{' '}
                                                      {moment(
                                                          currentProfile?.lastSeen ||
                                                              currentProfile?.joinedOn,
                                                      ).fromNow()}
                                                  </span>
                                              </div>
                                              <div className="list-row links-list-row">
                                                  <span className="pill">
                                                      <FontAwesomeIcon icon={faLink} />
                                                  </span>
                                                  <div className="profile-links-list">
                                                      {currentProfile?.links?.website && (
                                                          <a
                                                              href={currentProfile.links.website}
                                                              target="_blank"
                                                              rel="noreferrer"
                                                              className="profile-external-link"
                                                          >
                                                              Website
                                                          </a>
                                                      )}
                                                      {currentProfile?.links?.x && (
                                                          <a
                                                              href={
                                                                  currentProfile.links.x.startsWith(
                                                                      'http',
                                                                  )
                                                                      ? currentProfile.links.x
                                                                      : `https://x.com/${currentProfile.links.x.replace('@', '')}`
                                                              }
                                                              target="_blank"
                                                              rel="noreferrer"
                                                              className="profile-external-link"
                                                          >
                                                              X
                                                          </a>
                                                      )}
                                                      {currentProfile?.links?.github && (
                                                          <a
                                                              href={
                                                                  currentProfile.links.github.startsWith(
                                                                      'http',
                                                                  )
                                                                      ? currentProfile.links.github
                                                                      : `https://github.com/${currentProfile.links.github.replace('@', '')}`
                                                              }
                                                              target="_blank"
                                                              rel="noreferrer"
                                                              className="profile-external-link"
                                                          >
                                                              GitHub
                                                          </a>
                                                      )}
                                                      {!currentProfile?.links?.website &&
                                                          !currentProfile?.links?.x &&
                                                          !currentProfile?.links?.github && (
                                                              <span className="empty-text">
                                                                  No links added
                                                              </span>
                                                          )}
                                                  </div>
                                              </div>
                                          </div>

                                          <div className="profile-box">
                                              <div className="box-header">
                                                  <h3>Answered Questions</h3>
                                              </div>
                                              {answeredQuestions.length === 0 ? (
                                                  <p className="empty-text">
                                                      You have not answered any questions yet.
                                                  </p>
                                              ) : (
                                                  answeredQuestions.slice(0, 5).map((a) => (
                                                      <div className="list-row" key={a._id}>
                                                          <span className="pill">{a.score}</span>
                                                          <Link
                                                              to={`/Questions/${a.questionId}#answer-${a._id}`}
                                                              className="list-link"
                                                          >
                                                              {a.questionTitle}
                                                          </Link>
                                                          <span className="date-text">
                                                              {moment(a.answeredOn).fromNow()}
                                                          </span>
                                                      </div>
                                                  ))
                                              )}
                                          </div>
                                          <div className="profile-box">
                                              <div className="box-header">
                                                  <h3>Questions</h3>
                                              </div>
                                              {myQuestions.length === 0 ? (
                                                  <p className="empty-text">
                                                      You have not asked any questions.
                                                  </p>
                                              ) : (
                                                  myQuestions.slice(0, 5).map((q) => (
                                                      <div className="list-row" key={q._id}>
                                                          <span className="pill">
                                                              {q.noOfAnswers || 0}
                                                          </span>
                                                          <Link
                                                              to={`/Questions/${q._id}`}
                                                              className="list-link"
                                                          >
                                                              {q.questionTitle}
                                                          </Link>
                                                          <span className="date-text">
                                                              {moment(q.askedOn).fromNow()}
                                                          </span>
                                                      </div>
                                                  ))
                                              )}
                                          </div>
                                      </div>
                                  </>
                              )}

                              {activeTab === 'Answers' && (
                                  <div className="profile-box">
                                      <div className="box-header">
                                          <h3>Answered Questions</h3>
                                      </div>
                                      {answeredQuestions.length === 0 ? (
                                          <p className="empty-text">
                                              You have not answered any questions yet.
                                          </p>
                                      ) : (
                                          answeredQuestions.map((a) => (
                                              <div className="list-row" key={a._id}>
                                                  <span className="pill">{a.score}</span>
                                                  <Link
                                                      to={`/Questions/${a.questionId}#answer-${a._id}`}
                                                      className="list-link"
                                                  >
                                                      {a.questionTitle}
                                                  </Link>
                                                  <span className="date-text">
                                                      {moment(a.answeredOn).fromNow()}
                                                  </span>
                                              </div>
                                          ))
                                      )}
                                  </div>
                              )}

                              {activeTab === 'Questions' && (
                                  <div className="profile-box">
                                      <div className="box-header">
                                          <h3>Questions</h3>
                                      </div>
                                      {myQuestions.length === 0 ? (
                                          <p className="empty-text">
                                              You have not asked any questions.
                                          </p>
                                      ) : (
                                          myQuestions.map((q) => (
                                              <div className="list-row" key={q._id}>
                                                  <span className="pill">{q.noOfAnswers || 0}</span>
                                                  <Link
                                                      to={`/Questions/${q._id}`}
                                                      className="list-link"
                                                  >
                                                      {q.questionTitle}
                                                  </Link>
                                                  <span className="date-text">
                                                      {moment(q.askedOn).fromNow()}
                                                  </span>
                                              </div>
                                          ))
                                      )}
                                  </div>
                              )}

                              {activeTab === 'Tags' && (
                                  <div className="profile-box">
                                      <div className="box-header">
                                          <h3>Tags</h3>
                                      </div>
                                      {tagStats.length === 0 ? (
                                          <p className="empty-text">No tag activity yet.</p>
                                      ) : (
                                          tagStats.map(([tag, count]) => (
                                              <div className="list-row" key={tag}>
                                                  <span className="tag-chip-simple">{tag}</span>
                                                  <span className="date-text">
                                                      {count} post{count > 1 ? 's' : ''}
                                                  </span>
                                              </div>
                                          ))
                                      )}
                                  </div>
                              )}

                              {activeTab === 'Articles' && (
                                  <div className="profile-box">
                                      <div className="box-header">
                                          <h3>Articles</h3>
                                      </div>
                                      {myArticles.length === 0 ? (
                                          <p className="empty-text">No articles yet.</p>
                                      ) : (
                                          myArticles.map((article) => (
                                              <div className="list-row" key={article._id}>
                                                  <span className="pill">A</span>
                                                  <Link
                                                      to={`/Articles/${article._id}`}
                                                      className="list-link"
                                                  >
                                                      {article.articleTitle}
                                                  </Link>
                                                  <span className="date-text">
                                                      {moment(article.createdAt).fromNow()}
                                                  </span>
                                              </div>
                                          ))
                                      )}
                                  </div>
                              )}

                              {activeTab === 'Badges' && (
                                  <div className="profile-box">
                                      <div className="box-header">
                                          <h3>Badges</h3>
                                      </div>
                                      <div className="badges-showcase">
                                          <div className="badge-card">
                                              <p className="summary-big-number">{totalBadges}</p>
                                              <p className="summary-muted">total badges earned</p>
                                          </div>
                                          <div className="badge-card">
                                              <div className="badgeRow">
                                                  <ReputationBadge
                                                      level="gold"
                                                      count={badges.gold?.length || 0}
                                                  />
                                              </div>
                                              <div className="badgeRow">
                                                  <ReputationBadge
                                                      level="silver"
                                                      count={badges.silver?.length || 0}
                                                  />
                                              </div>
                                              <div className="badgeRow">
                                                  <ReputationBadge
                                                      level="bronze"
                                                      count={badges.bronze?.length || 0}
                                                  />
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              )}

                              {activeTab === 'Reputation' && (
                                  <div className="profile-box">
                                      <SummaryCard
                                          title="Reputation"
                                          value={reputation}
                                          subtitle="You have no recent reputation changes."
                                      />
                                  </div>
                              )}
                          </div>
                      </div>
                  )}
              </section>
          </div>
      </div>
  );
};

export default UserProfile;
