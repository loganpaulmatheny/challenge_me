import "./Badge.css";
import PropTypes from "prop-types";

export default function Badge({ children, variant = "default", label, role }) {
  return (
    <span
      className={`badge badge-${variant}`}
      aria-label={label}
      role={role}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "default",
    "primary",
    "terra",
    "gold",
    "success",
    "progress",
    "complete",
    "error",
    "warning",
    "info",
    "xp",
    "primary-filled",
    "terra-filled",
    "gold-filled",
  ]),
  label: PropTypes.string,
  role: PropTypes.string,
};
