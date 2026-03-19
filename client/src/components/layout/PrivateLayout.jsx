import { Navigate } from "react-router-dom";
import Navbar from "../ui/Navbar/Navbar";
import { useUser } from "../../context/UserContext";

export default function PrivateLayout({ children }) {
  const { user, loading } = useUser();

  // WAIT until context is ready
  if (loading) {
    return <div>Loading...</div>;
  }

  // AFTER loading → decide
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar user={user} />
      <div className="container py-4">
        {children}
      </div>
    </>
  );
}