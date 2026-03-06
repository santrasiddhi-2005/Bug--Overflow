const articlesReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "FETCH_ALL_ARTICLES":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default articlesReducer;
