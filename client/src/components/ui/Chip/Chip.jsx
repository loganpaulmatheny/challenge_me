import "./Chip.css";
import PropTypes from "prop-types";

export default function Chip({
  label,
  active = false,
  onClick,
  icon,
  disabled = false,
}) {
  return (
    <button
      type="button"
      className={[
        "chip",
        active ? "chip-active" : "",
        disabled ? "chip-disabled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      aria-pressed={active}
      disabled={disabled}
    >
      {icon && (
        <span className="chip-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {label}
    </button>
  );
}

Chip.propTypes = {
  label: PropTypes.node.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
};
