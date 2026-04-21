import PropTypes from "prop-types";
import "./Skeleton.css";

export default function Skeleton({
  variant = "line",
  width,
  height,
  className = "",
  style = {},
}) {
  const classes = [
    "skel",
    variant === "line"   ? "skel-line"   : "",
    variant === "circle" ? "skel-circle"  : "",
    variant === "avatar" ? "skel-avatar"  : "",
    variant === "badge"  ? "skel-badge"   : "",
    variant === "btn"    ? "skel-btn"     : "",
    variant === "card"   ? "skel-card"    : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <span
      className={classes}
      aria-hidden="true"
      style={{ width, height, display: "block", ...style }}
    />
  );
}

Skeleton.propTypes = {
  variant: PropTypes.oneOf(["line", "circle", "avatar", "badge", "btn", "card"]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  style: PropTypes.object,
};
