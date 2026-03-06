import React, { useEffect, useRef, useState } from "react";
import "./ToastContainer.css";

const ToastContainer = () => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleToast = (event) => {
      const { message, type = "error" } = event.detail || {};
      if (!message) return;

      setToast({ message, type });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setToast(null);
      }, 2500);
    };

    window.addEventListener("app-toast", handleToast);
    return () => {
      window.removeEventListener("app-toast", handleToast);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!toast) return null;

  return <div className={`app-toast ${toast.type}`}>{toast.message}</div>;
};

export default ToastContainer;
