import "./Navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div>ChallengeMe</div>

      <div className="nav-links">
        <div className="nav-item" onClick={() => navigate("/feed")}>
          Feed
        </div>

        <div className="nav-item" onClick={() => navigate("/dashboard")}>
          Dashboard
        </div>

        <div className="nav-item" onClick={() => navigate("/profile")}>
          Profile
        </div>

        {user?.role === "admin" && (
          <div className="nav-item" onClick={() => navigate("/admin")}>
            Admin
          </div>
        )}
      </div>
    </div>
  );
}