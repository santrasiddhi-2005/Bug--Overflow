import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../../api";
import useDebounce from "../../hooks/useDebounce";
import "./Search.css";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allResults, setAllResults] = useState({
    questions: [],
    users: [],
    tags: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setAllResults({ questions: [], users: [], tags: [] });
      setHasSearched(false);
      return;
    }

    const performFullSearch = async () => {
      setIsLoading(true);
      setHasSearched(true);
      try {
        const [questionsRes, usersRes, tagsRes] = await Promise.all([
          api.searchQuestions(debouncedQuery, 50, 0),
          api.searchUsers(debouncedQuery, 50, 0),
          api.searchTags(debouncedQuery, 50),
        ]);

        setAllResults({
          questions: questionsRes.data?.questions || [],
          users: usersRes.data?.users || [],
          tags: tagsRes.data?.tags || [],
        });
      } catch (error) {
        console.error("Search error:", error);
        setAllResults({ questions: [], users: [], tags: [] });
      } finally {
        setIsLoading(false);
      }
    };

    performFullSearch();
  }, [debouncedQuery]);

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1>Search Stack Overflow Clone</h1>
        <div className="search-page-input-container">
          <input
            type="text"
            className="search-page-input"
            placeholder="Search questions, users, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {isLoading && <div className="search-page-spinner"></div>}
        </div>
      </div>

      <div className="search-page-content">
        {isLoading ? (
          <div className="loading-message">Searching...</div>
        ) : !hasSearched ? (
          <div className="empty-state">
            <p>Enter a search query to get started</p>
          </div>
        ) : Object.values(allResults).every((arr) => arr.length === 0) ? (
          <div className="no-results-message">
            <p>No results found for "{searchQuery}"</p>
            <p>Try with different keywords</p>
          </div>
        ) : (
          <>
            {allResults.questions.length > 0 && (
              <section className="search-section">
                <h2 className="section-title">
                  Questions ({allResults.questions.length})
                </h2>
                <div className="search-results-list">
                  {allResults.questions.map((question) => (
                    <Link
                      key={question._id}
                      to={`/Questions/${question._id}`}
                      className="result-card question-card"
                    >
                      <h3>{question.questionTitle}</h3>
                      <p className="result-excerpt">
                        {question.questionBody.replace(/<[^>]*>/g, "").substring(0, 150)}...
                      </p>
                      <div className="result-tags">
                        {(Array.isArray(question.questionTags)
                          ? question.questionTags
                          : question.questionTags.toString().split(" ")
                        ).map((tag) => (
                          <span key={tag} className="tag-badge">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="result-meta">
                        <span className="meta-item">
                          {question.noOfAnswers} answers
                        </span>
                        <span className="meta-item">
                          {question.upVote.length} votes
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {allResults.users.length > 0 && (
              <section className="search-section">
                <h2 className="section-title">
                  Users ({allResults.users.length})
                </h2>
                <div className="search-results-grid">
                  {allResults.users.map((user) => (
                    <Link
                      key={user._id}
                      to={`/Users/${user._id}`}
                      className="result-card user-card"
                    >
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <h3>{user.name}</h3>
                      {user.about && <p className="user-about">{user.about}</p>}
                      {user.tags && user.tags.length > 0 && (
                        <div className="result-tags">
                          {user.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="tag-badge">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {allResults.tags.length > 0 && (
              <section className="search-section">
                <h2 className="section-title">Tags ({allResults.tags.length})</h2>
                <div className="tags-cloud">
                  {allResults.tags.map((tag) => (
                    <span key={tag} className="tag-cloud-item">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
