const authReducer = (state = { data: null, error: "" }, action) => {
  switch (action.type) {
    case "AUTH":
      localStorage.setItem("Profile", JSON.stringify({ ...action?.data }));
      return { ...state, data: action?.data, error: "" };
    case "AUTH_ERROR":
      return { ...state, error: action?.payload };
    case "CLEAR_ERROR":
      return { ...state, error: "" };
    case "LOGOUT":
      localStorage.clear();
      return { ...state, data: null, error: "" };
    default:
      return state;
  }
};

export default authReducer;
