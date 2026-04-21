import PropTypes from "prop-types";
import "./Toggle.css";

export default function Toggle({
  id,
  checked,
  onChange,
  label,
  size = "md",
  variant = "primary",
  disabled = false,
}) {
  return (
    <label
      className={[
        "tog-row",
        size === "sm" ? "tog-sm" : "",
        variant === "terra" ? "tog-terra" : "",
      ].filter(Boolean).join(" ")}
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        className="tog-input"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-checked={checked}
      />
      <div className="tog" aria-hidden="true">
        <div className="tog-thumb" />
      </div>
      {label && <span className="tog-label">{label}</span>}
    </label>
  );
}

Toggle.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  size: PropTypes.oneOf(["md", "sm"]),
  variant: PropTypes.oneOf(["primary", "terra"]),
  disabled: PropTypes.bool,
};
