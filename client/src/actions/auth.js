import * as api from "../api";
import { setCurrentUser } from "./currentUser";
import { fetchAllUsers } from "./users";

export const signup = (authData) => async (dispatch) => {
  try {
    dispatch({ type: "CLEAR_ERROR" });
    const { data } = await api.signUp(authData);
    return { success: true, data };
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || "An error occurred during signup";
    dispatch({ type: "AUTH_ERROR", payload: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export const login = (authData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: "CLEAR_ERROR" });
    const { data } = await api.logIn(authData);
    dispatch({ type: "AUTH", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
    navigate("/");
    return { success: true, data };
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || "An error occurred during login";
    dispatch({ type: "AUTH_ERROR", payload: errorMessage });
    const verificationRequired = Boolean(error?.response?.data?.verificationRequired);
    const email = error?.response?.data?.email || authData?.email;
    return { success: false, error: errorMessage, verificationRequired, email };
  }
};

export const verifySignupOtp = (payload) => async (dispatch) => {
  try {
    dispatch({ type: "CLEAR_ERROR" });
    const { data } = await api.verifySignupOtp(payload);
    dispatch({ type: "AUTH", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
    dispatch(fetchAllUsers());
    return { success: true, data };
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || "OTP verification failed";
    dispatch({ type: "AUTH_ERROR", payload: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export const resendSignupOtp = (payload) => async (dispatch) => {
  try {
    dispatch({ type: "CLEAR_ERROR" });
    const { data } = await api.resendSignupOtp(payload);
    return { success: true, data };
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || "Unable to resend OTP";
    dispatch({ type: "AUTH_ERROR", payload: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export const requestPasswordResetOtp = (payload) => async (dispatch) => {
  try {
    dispatch({ type: "CLEAR_ERROR" });
    const { data } = await api.forgotPassword(payload);
    return { success: true, data };
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || "Unable to request password reset OTP";
    dispatch({ type: "AUTH_ERROR", payload: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export const verifyResetOtp = (payload) => async (dispatch) => {
  try {
    dispatch({ type: "CLEAR_ERROR" });
    const { data } = await api.verifyResetOtp(payload);
    return { success: true, data };
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || "Reset OTP verification failed";
    dispatch({ type: "AUTH_ERROR", payload: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export const resetPassword = (payload) => async (dispatch) => {
  try {
    dispatch({ type: "CLEAR_ERROR" });
    const { data } = await api.resetPassword(payload);
    return { success: true, data };
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || "Unable to reset password";
    dispatch({ type: "AUTH_ERROR", payload: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export const clearAuthError = () => (dispatch) => {
  dispatch({ type: "CLEAR_ERROR" });
};
