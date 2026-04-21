import "./Avatar.css";
import PropTypes from "prop-types";

export default function Avatar({ src, username = "", size = 48, decorative = false }) {
  const initials = username.slice(0, 2).toUpperCase() || "?";
  const fontSize = Math.max(12, Math.round(size * 0.38));

  if (src) {
    return (
      <img
        src={src}
        alt={decorative ? "" : `${username}'s avatar`}
        className="avatar"
        style={{ width: size, height: size }}
        aria-hidden={decorative ? "true" : undefined}
      />
    );
  }

  return (
    <div
      className="avatar avatar-fallback"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `${username}'s avatar`}
      aria-hidden={decorative ? "true" : undefined}
      style={{ width: size, height: size, fontSize }}
    >
      <span aria-hidden="true">{initials}</span>
    </div>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  username: PropTypes.string,
  size: PropTypes.number,
  decorative: PropTypes.bool,
};
