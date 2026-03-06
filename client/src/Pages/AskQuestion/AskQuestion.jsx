import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./AskQuestion.css";
import { askQuestion } from "../../actions/question";
import TextEditor from "../../components/TextEditor/TextEditor";
import { showToast } from "../../utils/toast";

const AskQuestion = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [questionTags, setQuestionTags] = useState("");

  const dispatch = useDispatch();
  const User = useSelector((state) => state.currentUserReducer);
  const navigate = useNavigate();

  const handleTagsKeyDown = (e) => {
    // Add tag on Space, Tab, or Enter
    if (e.key === " " || e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      const currentValue = e.target.value.trim();
      if (currentValue) {
        setQuestionTags((prev) => prev + (prev ? " " : "") + currentValue);
        e.target.value = "";
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (User) {
      // Remove HTML tags for plain text storage
      const plainTextBody = questionBody.replace(/<[^>]*>/g, "");
      // build tags array from space-separated string
      const tagsArray = questionTags
        .split(" ")
        .map((t) => t.trim())
        .filter((t) => t);
      if (questionTitle && plainTextBody.trim() && tagsArray.length > 0) {
        dispatch(
          askQuestion(
            {
              questionTitle,
              questionBody: questionBody,
              questionTags: tagsArray,
              userPosted: User.result.name,
            },
            navigate
          )
        );
      } else showToast("Please enter all the fields");
    } else showToast("Login to ask question");
  };
  return (
    <div className="ask-question">
      <div className="ask-ques-container">
        <h1>Ask a public Question</h1>
        <form onSubmit={handleSubmit}>
          <div className="ask-form-container">
            <label htmlFor="ask-ques-title">
              <h4>Title</h4>
              <p>
                Be specific and imagine you’re asking a question to another
                person
              </p>
              <input
                type="text"
                id="ask-ques-title"
                onChange={(e) => {
                  setQuestionTitle(e.target.value);
                }}
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
              />
            </label>
            <div className="ask-ques-body-container">
              <h4>Body</h4>
              <p>
                Include all the information someone would need to answer your
                question
              </p>
              <TextEditor
                value={questionBody}
                onChange={setQuestionBody}
                placeholder="Enter your question details, code snippets, error messages, etc."
              />
            </div>
            <label htmlFor="ask-ques-tags">
              <h4>Tags</h4>
              <p>Add up to 5 tags to describe what your question is about</p>
              <div className="tags-input-container">
                <input
                  type="text"
                  id="ask-ques-tags"
                  onKeyDown={handleTagsKeyDown}
                  placeholder="e.g. xml typescript wordpress (press Space, Tab, or Enter to add)"
                />
                {questionTags && (
                  <div className="tags-display">
                    {questionTags.split(" ").filter(tag => tag).map((tag, index) => (
                      <span key={index} className="tag-chip">
                        {tag}
                        <button
                          type="button"
                          onClick={() => {
                            const tagsArray = questionTags.split(" ").filter(t => t);
                            tagsArray.splice(index, 1);
                            setQuestionTags(tagsArray.join(" "));
                          }}
                          className="tag-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </label>
          </div>
          <input
            type="submit"
            value="Reivew your question"
            className="review-btn"
          />
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;
