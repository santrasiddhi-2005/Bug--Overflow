export const showToast = (message, type = "error") => {
  window.dispatchEvent(
    new CustomEvent("app-toast", {
      detail: { message, type },
    })
  );
};
