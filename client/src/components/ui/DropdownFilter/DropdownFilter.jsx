import "./DropdownFilter.css";
import PropTypes from "prop-types";

export default function DropdownFilter({ label, options, value, onChange }) {
  const id = `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="dropdown-filter">
      <label className="dropdown-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="dropdown-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="All">All</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

DropdownFilter.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
