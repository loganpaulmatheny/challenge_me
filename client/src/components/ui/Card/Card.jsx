import PropTypes from "prop-types";

export default function Card({
  children,
  interactive = false,
  selected = false,
  variant = "default",
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        card 
        card-${variant}
        ${interactive ? "card-hover" : ""}
        ${selected ? "card-selected" : ""}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  interactive: PropTypes.bool,
  selected: PropTypes.bool,
  variant: PropTypes.string,
  onClick: PropTypes.func,
};
