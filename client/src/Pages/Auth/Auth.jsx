import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./Auth.css";
import icon from "../../assets/bugOverflow.png";
import AboutAuth from "./AboutAuth";
import {
  signup,
  login,
  clearAuthError,
  verifySignupOtp,
  resendSignupOtp,
  requestPasswordResetOtp,
  verifyResetOtp,
  resetPassword,
} from "../../actions/auth";
import { showToast } from "../../utils/toast";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isSignupOtpStep, setIsSignupOtpStep] = useState(false);
  const [isForgotFlow, setIsForgotFlow] = useState(false);
  const [forgotStep, setForgotStep] = useState("request");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupOtp, setSignupOtp] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.authReducer.error);

  const resetAllState = () => {
    setName("");
    setEmail("");
    setPassword("");
    setSignupOtp("");
    setResetOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSwitch = () => {
    setIsSignup(!isSignup);
    setIsSignupOtpStep(false);
    setIsForgotFlow(false);
    setForgotStep("request");
    resetAllState();
    dispatch(clearAuthError());
  };

  const handleStartForgotFlow = () => {
    setIsForgotFlow(true);
    setIsSignup(false);
    setIsSignupOtpStep(false);
    setForgotStep("request");
    setPassword("");
    setSignupOtp("");
    dispatch(clearAuthError());
  };

  const handleExitForgotFlow = () => {
    setIsForgotFlow(false);
    setForgotStep("request");
    setResetOtp("");
    setNewPassword("");
    setConfirmPassword("");
    dispatch(clearAuthError());
  };

  const handleRequestResetOtp = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    if (!email) {
      showToast("Enter your email");
      return;
    }

    const result = await dispatch(requestPasswordResetOtp({ email }));
    if (result?.success) {
      showToast(result?.data?.message || "OTP sent to email", "success");
      setForgotStep("verify");
    }
  };

  const handleVerifyResetOtp = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    if (!resetOtp || resetOtp.length < 6) {
      showToast("Enter valid 6-digit OTP");
      return;
    }

    const result = await dispatch(verifyResetOtp({ email, otp: resetOtp }));
    if (result?.success) {
      showToast(result?.data?.message || "OTP verified", "success");
      setForgotStep("reset");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    if (!newPassword || newPassword.length < 6) {
      showToast("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match");
      return;
    }

    const result = await dispatch(resetPassword({ email, newPassword }));
    if (result?.success) {
      showToast(result?.data?.message || "Password reset successful", "success");
      setIsForgotFlow(false);
      setForgotStep("request");
      setIsSignup(false);
      setPassword("");
      setResetOtp("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleVerifySignupOtp = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    if (!signupOtp || signupOtp.length < 6) {
      showToast("Enter valid 6-digit OTP");
      return;
    }

    const result = await dispatch(verifySignupOtp({ email, otp: signupOtp }));
    if (result?.success) {
      showToast("Email verified successfully", "success");
      navigate("/");
    }
  };

  const handleResendSignupOtp = async () => {
    if (!email) {
      showToast("Missing email for OTP resend");
      return;
    }
    const result = await dispatch(resendSignupOtp({ email }));
    if (result?.success) {
      showToast(result?.data?.message || "OTP resent", "success");
    }
  };

  const handleResendResetOtp = async () => {
    if (!email) {
      showToast("Enter your email first");
      return;
    }
    const result = await dispatch(requestPasswordResetOtp({ email }));
    if (result?.success) {
      showToast(result?.data?.message || "OTP resent", "success");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    if (isForgotFlow) {
      if (forgotStep === "request") {
        await handleRequestResetOtp(e);
      } else if (forgotStep === "verify") {
        await handleVerifyResetOtp(e);
      } else {
        await handleResetPassword(e);
      }
      return;
    }

    if (isSignupOtpStep) {
      await handleVerifySignupOtp(e);
      return;
    }

    if (!email || !password) {
      showToast("Enter email and password");
      return;
    }

    if (isSignup) {
      if (!name) {
        showToast("Enter a name to continue");
        return;
      }

      const result = await dispatch(signup({ name, email, password }));
      if (result?.success) {
        showToast(result?.data?.message || "OTP sent to email", "success");
        setIsSignupOtpStep(true);
      }
    } else {
      const result = await dispatch(login({ email, password }, navigate));
      if (result?.verificationRequired) {
        setIsSignup(true);
        setIsSignupOtpStep(true);
        if (result?.email) {
          setEmail(result.email);
        }
        showToast("Please verify email with OTP before login");
      }
    }
  };

  const authTitle = isForgotFlow
    ? "Reset your password"
    : isSignupOtpStep
      ? "Verify your email"
      : isSignup
        ? "Create your account"
        : "Welcome back";

  return (
    <section className="auth-section">
      {isSignup && !isForgotFlow && <AboutAuth />}
      <div className="auth-container-2">
        <img src={icon} alt="bugoverflow" className="login-logo" />
        <h3 className="auth-title">{authTitle}</h3>
        <form onSubmit={handleSubmit}>
          {error && <h5 className="errorText">{error}</h5>}

          {!isForgotFlow && isSignup && !isSignupOtpStep && (
            <label htmlFor="name">
              <h4>Display Name</h4>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </label>
          )}

          <label htmlFor="email">
            <h4>Email</h4>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              disabled={isSignupOtpStep || forgotStep === "verify" || forgotStep === "reset"}
            />
          </label>

          {!isForgotFlow && !isSignupOtpStep && (
            <label htmlFor="password">
              <div className="auth-row-between">
                <h4>Password</h4>
                {!isSignup && (
                  <button
                    type="button"
                    className="inline-link-btn"
                    onClick={handleStartForgotFlow}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </label>
          )}

          {isSignupOtpStep && (
            <label htmlFor="signupOtp">
              <div className="auth-row-between">
                <h4>Signup OTP</h4>
                <button type="button" className="inline-link-btn" onClick={handleResendSignupOtp}>
                  Resend OTP
                </button>
              </div>
              <input
                type="text"
                id="signupOtp"
                value={signupOtp}
                onChange={(e) => setSignupOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
            </label>
          )}

          {isForgotFlow && forgotStep === "verify" && (
            <label htmlFor="resetOtp">
              <div className="auth-row-between">
                <h4>Reset OTP</h4>
                <button type="button" className="inline-link-btn" onClick={handleResendResetOtp}>
                  Resend OTP
                </button>
              </div>
              <input
                type="text"
                id="resetOtp"
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
            </label>
          )}

          {isForgotFlow && forgotStep === "reset" && (
            <>
              <label htmlFor="newPassword">
                <h4>New Password</h4>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>
              <label htmlFor="confirmPassword">
                <h4>Confirm Password</h4>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
            </>
          )}

          <button type="submit" className="auth-btn">
            {isForgotFlow
              ? forgotStep === "request"
                ? "Send OTP"
                : forgotStep === "verify"
                  ? "Verify OTP"
                  : "Reset Password"
              : isSignupOtpStep
                ? "Verify & Continue"
                : isSignup
                  ? "Sign up"
                  : "Log in"}
          </button>

          {(isSignupOtpStep || isForgotFlow) && (
            <button
              type="button"
              className="secondary-auth-btn"
              onClick={() => {
                if (isForgotFlow) {
                  handleExitForgotFlow();
                } else {
                  setIsSignupOtpStep(false);
                  setSignupOtp("");
                }
              }}
            >
              Back
            </button>
          )}
        </form>

        {!isSignupOtpStep && !isForgotFlow && (
          <p>
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              className="handle-switch-btn"
              onClick={handleSwitch}
            >
              {isSignup ? "Log in" : "sign up"}
            </button>
          </p>
        )}
      </div>
    </section>
  );
};

export default Auth;
