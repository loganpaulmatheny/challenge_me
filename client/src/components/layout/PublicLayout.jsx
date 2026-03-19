import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function PublicLayout({ children }) {
  const { user, loading } = useUser();

  // WAIT first
  if (loading) {
    return <div>Loading...</div>;
  }

  // Only redirect AFTER loading
  if (user) {
    return <Navigate to="/feed" replace />;
  }

  return children;
}