import Navbar from "../ui/Navbar/Navbar";
import "./layout.css";
import PropTypes from "prop-types";

export default function AppLayout({ children, user }) {
  return (
    <div className="app-shell">
      <Navbar user={user} />
      <main className="app-content">
        {children}
      </main>
    </div>
  );
}

AppLayout.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node,
};
