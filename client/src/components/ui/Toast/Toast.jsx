import PropTypes from "prop-types";
import "./Toast.css";

const ICONS = {
  success: "✓",
  error:   "✕",
  warning: "⚠",
  info:    "ℹ",
  neutral: "✦",
  xp:      "★",
};

export function ToastRegion({ toasts, dismiss }) {
  return (
    <div
      className="toast-region"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type}${t.exiting ? " toast-exiting" : ""}`}
          role="status"
        >
          <span className="toast-icon" aria-hidden="true">{ICONS[t.type]}</span>
          <div className="toast-body">
            {t.title && <div className="toast-title">{t.title}</div>}
            {t.msg && <div className="toast-msg">{t.msg}</div>}
          </div>
          <button
            className="toast-close"
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss notification"
            type="button"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

ToastRegion.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.oneOf(["success", "error", "warning", "info", "neutral", "xp"]).isRequired,
      title: PropTypes.string,
      msg: PropTypes.string,
      exiting: PropTypes.bool,
    })
  ).isRequired,
  dismiss: PropTypes.func.isRequired,
};
