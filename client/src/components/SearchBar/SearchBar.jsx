import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faQuestionCircle,
  faUser,
  faTag,
  faFileAlt,
  faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import * as api from "../../api";
import useDebounce from "../../hooks/useDebounce";
import "./SearchBar.css";

const SearchBar = ({ onSearchTypeChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("questions");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      try {
        let response;
        switch (searchType) {
          case "questions":
            response = await api.searchQuestions(debouncedQuery, 10, 0);
            setResults(response.data?.questions || []);
            break;
          case "users":
            response = await api.searchUsers(debouncedQuery, 10, 0);
            setResults(response.data?.users || []);
            break;
          case "tags":
            response = await api.searchTags(debouncedQuery, 10);
            setResults(response.data?.tags || []);
            break;
          default:
            setResults([]);
        }
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, searchType]);

  const handleSelectResult = (result) => {
    if (searchType === "questions") {
      navigate(`/Questions/${result._id}`);
    } else if (searchType === "users") {
      navigate(`/Users/${result._id}`);
    } else if (searchType === "tags") {
      navigate("/Tags");
      setSearchQuery("");
    }
    setShowDropdown(false);
    setSearchQuery("");
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchQuery("");
    setResults([]);
    setShowDropdown(false);
    if (onSearchTypeChange) {
      onSearchTypeChange(type);
    }
  };

  const renderResultItem = (result, index) => {
    if (searchType === "questions") {
      return (
        <div
          key={index}
          className="search-result-item"
          onClick={() => handleSelectResult(result)}
        >
          <div className="result-icon">
            <FontAwesomeIcon icon={faQuestionCircle} />
          </div>
          <div className="result-content">
            <div className="result-title">{result.questionTitle}</div>
            <div className="result-tags">
              {result.questionTags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag-badge">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    } else if (searchType === "users") {
      return (
        <div
          key={index}
          className="search-result-item"
          onClick={() => handleSelectResult(result)}
        >
          <div className="result-icon user-icon">
            {result.name.charAt(0).toUpperCase()}
          </div>
          <div className="result-content">
            <div className="result-title">{result.name}</div>
            {result.about && <div className="result-subtitle">{result.about}</div>}
          </div>
        </div>
      );
    } else if (searchType === "tags") {
      return (
        <div
          key={index}
          className="search-result-item"
          onClick={() => handleSelectResult(result)}
        >
          <div className="result-icon">
            <FontAwesomeIcon icon={faTag} />
          </div>
          <div className="result-content">
            <span className="tag-badge large">{result}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-layout">
        {/* Left Side - Type Dropdown */}
        <div className="type-selector-wrapper">
          <button
            className="type-selector-btn"
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            title="Select search type"
          >
            <FontAwesomeIcon
              icon={
                searchType === "questions"
                  ? faQuestionCircle
                  : searchType === "users"
                  ? faUser
                  : faTag
              }
              className="type-icon"
            />
            <span className="type-label">
              {searchType.charAt(0).toUpperCase() + searchType.slice(1)}
            </span>
            <FontAwesomeIcon icon={faArrowDown} />
          </button>

          {showTypeDropdown && (
            <div className="type-dropdown-menu">
              <button
                className={`type-option ${searchType === "questions" ? "active" : ""}`}
                onClick={() => {
                  handleSearchTypeChange("questions");
                  setShowTypeDropdown(false);
                }}
              >
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>Questions</span>
              </button>
              <button
                className={`type-option ${searchType === "users" ? "active" : ""}`}
                onClick={() => {
                  handleSearchTypeChange("users");
                  setShowTypeDropdown(false);
                }}
              >
                <FontAwesomeIcon icon={faUser} />
                <span>Users</span>
              </button>
              <button
                className={`type-option ${searchType === "tags" ? "active" : ""}`}
                onClick={() => {
                  handleSearchTypeChange("tags");
                  setShowTypeDropdown(false);
                }}
              >
                <FontAwesomeIcon icon={faTag} />
                <span>Tags</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Search Input */}
        <div className="search-input-wrapper">
          <div className="search-input-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon-input" />
            <input
              type="text"
              className="search-input"
              placeholder={`Search ${searchType}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {isLoading && <div className="search-spinner"></div>}
          </div>

          {showDropdown && (
            <div className="search-dropdown">
              <div className="dropdown-content">
                {results.length > 0 ? (
                  <div className="search-results">
                    {results.map((result, index) => renderResultItem(result, index))}
                  </div>
                ) : debouncedQuery.trim() && !isLoading ? (
                  <div className="no-results">
                    <FontAwesomeIcon icon={faFileAlt} />
                    <p>No results found for "{debouncedQuery}"</p>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
