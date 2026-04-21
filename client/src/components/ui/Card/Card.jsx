import "./Card.css";
import PropTypes from "prop-types";

export default function Card({
  children,
  interactive = false,
  selected = false,
  variant = "default",
  tint = null,
  onClick,
  className = "",
  ...props
}) {
  const Tag = interactive ? "button" : "div";

  return (
    <Tag
      type={interactive ? "button" : undefined}
      onClick={onClick}
      className={[
        "card",
        `card-${variant}`,
        tint ? `card-tint-${tint}` : "",
        interactive ? "card-interactive" : "",
        selected ? "card-selected" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-pressed={interactive && selected ? true : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  interactive: PropTypes.bool,
  selected: PropTypes.bool,
  variant: PropTypes.oneOf(["default", "soft", "ghost", "raised"]),
  tint: PropTypes.oneOf(["teal", "terra", "gold", "mist", "sketch", "lace"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
  role: PropTypes.string,
  "aria-labelledby": PropTypes.string,
  "aria-label": PropTypes.string,
};
