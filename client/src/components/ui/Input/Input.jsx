import "./Input.css";
import PropTypes from "prop-types";

export default function Input({
  id,
  label,
  hint,
  error,
  prefix,
  suffix,
  disabled = false,
  className = "",
  ...props
}) {
  const describedBy = [
    hint && !error ? `${id}-hint` : null,
    error ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div
        className={[
          "input-wrap",
          error ? "input-wrap-error" : "",
          disabled ? "input-wrap-disabled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {prefix && (
          <span className="input-prefix" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={id}
          className="input"
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          {...props}
        />
        {suffix && (
          <span className="input-suffix" aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
      {hint && !error && (
        <p className="input-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="input-error-msg" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
