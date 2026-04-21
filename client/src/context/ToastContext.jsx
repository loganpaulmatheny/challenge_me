import { createContext, useCallback, useContext, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ToastRegion } from "../components/ui/Toast/Toast";

const ToastContext = createContext(null);

const DURATION = 3800;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 240);
  }, []);

  const add = useCallback(
    (type, title, msg, duration = DURATION) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, type, title, msg }]);
      setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const toast = {
    success: (msg, title = "Done")        => add("success", title, msg),
    error:   (msg, title = "Something went wrong") => add("error", title, msg),
    warning: (msg, title = "Heads up")   => add("warning", title, msg),
    info:    (msg, title = "")            => add("info",    title, msg),
    neutral: (msg, title = "")            => add("neutral", title, msg),
    xp:      (msg, title = "XP Earned")  => add("xp",      title, msg),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastRegion toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
