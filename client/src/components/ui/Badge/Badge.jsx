import "./Badge.css";
import PropTypes from "prop-types";

export default function Badge({ children, variant = "default", label }) {
  return (
    <span
      className={`badge badge-${variant}`}
      aria-label={label}
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
  ]),
  label: PropTypes.string,
};
