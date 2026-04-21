import PropTypes from "prop-types";
import "./SegTabs.css";

export default function SegTabs({ tabs, value, onChange, size = "md", className = "" }) {
  return (
    <div
      className={`seg-tabs${size === "sm" ? " seg-tabs-sm" : ""}${className ? ` ${className}` : ""}`}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          className={`seg-tab${value === tab.value ? " seg-tab-active" : ""}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
          {tab.count != null && (
            <span className="seg-tab-count">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

SegTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["md", "sm"]),
  className: PropTypes.string,
};
