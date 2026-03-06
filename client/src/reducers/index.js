import { combineReducers } from "redux";
import authReducer from "./auth";
import currentUserReducer from "./currentUser";
import questionsReducer from "./questions";
import usersReducer from "./users";
import notificationsReducer from "./notifications";
import bookmarksReducer from "./bookmarks";
import articlesReducer from "./articles";

export default combineReducers({
  authReducer,
  currentUserReducer,
  questionsReducer,
  usersReducer,
  notificationsReducer,
  bookmarksReducer,
  articlesReducer,
});
