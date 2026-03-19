import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import "./Navbar.css";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  return (
    <div className="navbar soft-card">
      <div className="nav-logo" onClick={() => navigate("/feed")}>
        ChallengeMe
      </div>

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
      </div>
    </div>
  );
}