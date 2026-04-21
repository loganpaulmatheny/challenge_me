import "./Card.css";
import PropTypes from "prop-types";

export default function Card({
  children,
  interactive = false,
  selected = false,
  variant = "default",
  onClick,
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
        interactive ? "card-interactive" : "",
        selected ? "card-selected" : "",
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
  onClick: PropTypes.func,
};
