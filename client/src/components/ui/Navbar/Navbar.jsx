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
    `ci-nav-link${isActive ? " ci-nav-link-active" : ""}`;

  return (
    <div className="ci-nav-wrap">
      <nav className="ci-navbar" aria-label="Main navigation">
        <NavLink className="ci-nav-logo" to="/feed">
          Challenge Me
        </NavLink>

        <div className="ci-nav-links">
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
        </div>

        <button className="ci-nav-logout" onClick={handleLogout} type="button">
          Logout
        </button>
      </nav>
    </div>
  );
}

Navbar.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
};
