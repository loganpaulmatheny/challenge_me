import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./layout.css";
import PropTypes from "prop-types";

export default function PublicLayout({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-dots" aria-label="Loading">
          <span /><span /><span />
        </div>
        <p className="app-loading-text">Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/feed" replace />;
  }

  return children;
}

PublicLayout.propTypes = {
  children: PropTypes.node,
};
