import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  type = "button",
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
    >
      {loading ? "..." : children}
    </button>
  );
}