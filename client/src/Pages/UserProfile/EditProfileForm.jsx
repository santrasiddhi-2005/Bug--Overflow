import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../actions/users";
import { showToast } from "../../utils/toast";

const COUNTRY_OPTIONS = ["India", "USA", "China", "Canada", "UK", "Germany", "France", "Japan", "Australia", "Brazil"];

const EditProfileForm = ({ currentUser, currentProfile, setSwitch }) => {
  const [name, setName] = useState(currentProfile?.name || currentUser?.result?.name || "");
  const [about, setAbout] = useState(currentProfile?.about || currentUser?.result?.about || "");
  const [tags, setTags] = useState(currentProfile?.tags || currentUser?.result?.tags || []);
  const [location, setLocation] = useState(currentProfile?.location || currentUser?.result?.location || "India");
  const [website, setWebsite] = useState(currentProfile?.links?.website || currentUser?.result?.links?.website || "");
  const [xLink, setXLink] = useState(currentProfile?.links?.x || currentUser?.result?.links?.x || "");
  const [github, setGithub] = useState(currentProfile?.links?.github || currentUser?.result?.links?.github || "");
  const dispatch = useDispatch();

  const handleTagsKeyDown = (e) => {
    // Add tag on Space, Tab, or Enter
    if (e.key === " " || e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      const currentValue = e.target.value.trim();
      if (currentValue) {
        setTags((prev) => [...prev, currentValue]);
        e.target.value = "";
      }
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name?.trim()) {
      showToast("Display name is required");
      return;
    }

    dispatch(
      updateProfile(currentUser?.result?._id, {
        name: name.trim(),
        about,
        tags: Array.isArray(tags) ? tags.filter((tag) => tag?.trim()) : [],
        location,
        links: {
          website: website.trim(),
          x: xLink.trim(),
          github: github.trim(),
        },
      })
    );
    showToast("Profile updated", "success");
    setSwitch(false);
  };

  return (
    <div>
      <h1 className="edit-profile-title">Edit Your Profile</h1>
      <h2 className="edit-profile-title-2">Public information</h2>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label htmlFor="name">
          <h3>Display name</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label htmlFor="about">
          <h3>About me</h3>
          <textarea
            id="about"
            cols="30"
            rows="10"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
        </label>
        <label htmlFor="location">
          <h3>Location</h3>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="profile-select"
          >
            {COUNTRY_OPTIONS.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>

        <div className="links-section">
          <h3>Links</h3>
          <div className="links-grid">
            <label htmlFor="website-link">
              <p>Website link</p>
              <input
                type="text"
                id="website-link"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </label>

            <label htmlFor="x-link">
              <p>X link or username</p>
              <input
                type="text"
                id="x-link"
                value={xLink}
                onChange={(e) => setXLink(e.target.value)}
                placeholder="@username or https://x.com/username"
              />
            </label>

            <label htmlFor="github-link">
              <p>GitHub link or username</p>
              <input
                type="text"
                id="github-link"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="username or https://github.com/username"
              />
            </label>
          </div>
        </div>

        <label htmlFor="tags">
          <h3>Watched tags</h3>
          <p>Add tags (press Space, Tab, or Enter to add)</p>
          <div className="tags-input-container">
            <input
              type="text"
              id="tags"
              onKeyDown={handleTagsKeyDown}
              placeholder="e.g. javascript react python (press Space, Tab, or Enter to add)"
            />
            {tags.length > 0 && (
              <div className="tags-display">
                {tags.map((tag, index) => (
                  <span key={index} className="tag-chip">
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        setTags((prev) => prev.filter((_, i) => i !== index));
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
        <br />
        <input type="submit" value="Save profile" className="user-submit-btn" />
        <button
          type="button"
          className="user-cancel-btn"
          onClick={() => setSwitch(false)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;
