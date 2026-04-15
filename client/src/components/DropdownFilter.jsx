import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


function DropdownFilter({ label, options, value, onChange }) {
  return (
    <div className="dropdown-filter">
      <label>{label}</label>

      <DropdownButton
        id={`dropdown-${label}`}
        // Shows either the current value or the associated label
        title={value || label}
        onSelect={(val) => onChange(val)}
      >
        <Dropdown.Item eventKey="All">All</Dropdown.Item>
        {options.map((item) => (
          // Key is for react rendering and eventKey will be the value flowing 
          // through onChange setter
          <Dropdown.Item key={item} eventKey={item}>{item}</Dropdown.Item>
        ))}
      </DropdownButton>
    </div>


  );
}

export default DropdownFilter;
