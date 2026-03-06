const bookmarksReducer = (state = { questions: [], articles: [], data: [] }, action) => {
  switch (action.type) {
    case "FETCH_BOOKMARKS":
      return {
        ...state,
        questions: action.payload?.questions || [],
        articles: action.payload?.articles || [],
        data: action.payload?.questions || [],
      };
    default:
      return state;
  }
};

export default bookmarksReducer;
