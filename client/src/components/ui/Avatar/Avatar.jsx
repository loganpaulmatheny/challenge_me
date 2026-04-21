import "./Avatar.css";
import PropTypes from "prop-types";

export default function Avatar({ src, username = "", size = 48 }) {
  const initials = username.slice(0, 2).toUpperCase() || "?";
  const fontSize = Math.max(10, Math.round(size * 0.38));

  if (src) {
    return (
      <img
        src={src}
        alt={`${username}'s avatar`}
        className="avatar"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="avatar avatar-fallback"
      role="img"
      aria-label={`${username}'s avatar`}
      style={{ width: size, height: size, fontSize }}
    >
      {initials}
    </div>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  username: PropTypes.string,
  size: PropTypes.number,
};
