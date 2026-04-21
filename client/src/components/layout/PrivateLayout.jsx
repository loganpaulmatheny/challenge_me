import { Navigate } from "react-router-dom";
import Navbar from "../ui/Navbar/Navbar";
import { useUser } from "../../context/UserContext";
import "./layout.css";
import PropTypes from "prop-types";

export default function PrivateLayout({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="app-loading" role="status" aria-label="Loading application">
        <div className="app-loading-dots" aria-hidden="true">
          <span /><span /><span />
        </div>
        <p className="app-loading-text">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-shell">
      <Navbar user={user} />
      <div className="app-content">
        {children}
      </div>
    </div>
  );
}

PrivateLayout.propTypes = {
  children: PropTypes.node,
};
