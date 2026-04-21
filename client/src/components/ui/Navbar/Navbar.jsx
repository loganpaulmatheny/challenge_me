import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import "./Navbar.css";
import PropTypes from "prop-types";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const { logout } = useUser();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `nav-link${isActive ? " nav-link-active" : ""}`;

  return (
    <nav className="navbar" aria-label="Main navigation">
      <NavLink className="nav-logo" to="/feed">
        ChallengeMe
      </NavLink>

      <div className="nav-links">
        <NavLink to="/feed" className={linkClass}>
          Feed
        </NavLink>
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
        {user?.role === "admin" && (
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
        )}
        <button className="nav-logout" onClick={handleLogout} type="button">
          Logout
        </button>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
};
