import * as api from "../api";
import { setCurrentUser } from "./currentUser";

export const fetchAllUsers = () => async (dispatch) => {
  try {
    const { data } = await api.getAllUsers();
    dispatch({ type: "FETCH_USERS", payload: data });
  } catch (error) {
    console.log(error);
  }
};
export const updateProfile = (id, updateData) => async (dispatch) => {
  try {
    const { data } = await api.updateProfile(id, updateData);
    dispatch({ type: "UPDATE_CURRENT_USER", payload: data });

    const storedProfile = JSON.parse(localStorage.getItem("Profile"));
    if (storedProfile?.result?._id === data._id) {
      const updatedStoredProfile = { ...storedProfile, result: { ...storedProfile.result, ...data } };
      localStorage.setItem("Profile", JSON.stringify(updatedStoredProfile));
      dispatch(setCurrentUser(updatedStoredProfile));
    }

    dispatch(fetchAllUsers());
  } catch (error) {
    console.log(error);
  }
};
