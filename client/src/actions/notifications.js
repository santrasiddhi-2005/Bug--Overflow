import * as api from "../api";

export const fetchNotifications = () => async (dispatch) => {
  try {
    const { data } = await api.getNotifications();
    dispatch({ type: "FETCH_NOTIFICATIONS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const markNotificationRead = (id) => async (dispatch) => {
  try {
    await api.markNotificationRead(id);
    dispatch({ type: "MARK_NOTIFICATION_READ", payload: id });
  } catch (error) {
    console.log(error);
  }
};

export const markAllNotificationsRead = () => async (dispatch) => {
  try {
    await api.markAllNotificationsRead();
    dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" });
  } catch (error) {
    console.log(error);
  }
};
