const notificationsReducer = (state = { data: [], unreadCount: 0 }, action) => {
  switch (action.type) {
    case "FETCH_NOTIFICATIONS":
      return {
        ...state,
        data: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length,
      };
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        data: state.data.map(n =>
          n._id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        data: state.data.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      };
    default:
      return state;
  }
};

export default notificationsReducer;
