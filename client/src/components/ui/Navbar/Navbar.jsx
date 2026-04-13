import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import Button from "../Button/Button";
import "./Navbar.css";
import { Link } from 'react-router'
import PropTypes from "prop-types";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const { logout } = useUser();

  return (
    <div className="local-navbar soft-card">
      <Link className="nav-logo" onClick={() => navigate("/feed")}>
        ChallengeMe
      </Link>

      <div className="nav-links">
        <Button variant="ghost" onClick={() => navigate("/feed")}>
          Feed
        </Button>

        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          Dashboard
        </Button>

        <Button variant="ghost" onClick={() => navigate("/profile")}>
          Profile
        </Button>

        {/* {user?.role === "admin" && ( */}
        <Button variant="ghost" onClick={() => navigate("/admin")}>
          Admin
        </Button>
        {/* )} */}

        <Button
          variant="ghost"
          onClick={async () => {
            await logout();
            navigate("/");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
