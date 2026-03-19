import { useState, useEffect, useCallback } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import UserList from "../../components/UserList.jsx";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo.jsx";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [query, setQuery] = useState("");

  // FETCH CURRENT USER
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/user", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  // FETCH USERS (optional / can remove later)
  const reloadUsers = useCallback(async () => {
    try {
      const res = await fetch(`/api/users?q=${query}`);
      if (!res.ok) return;

      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, [query]);

  useEffect(() => {
    const timeout = setTimeout(reloadUsers, 300);
    return () => clearTimeout(timeout);
  }, [reloadUsers]);

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold">
          Your Challenge Dashboard
        </h1>
        <p className="text-muted">
          Track your challenges and connect with others
        </p>
        <hr className="w-25 mx-auto" />
      </div>

      {/* PROFILE */}
      <ProfileInfo user={user} onUserUpdate={setUser} />

      {/* MAIN CONTENT */}
      <section>
        <Row>
          <Col md={8} xs={12}>
            {/* Optional - can remove if unused */}
            {/* <UserList users={users} query={query} setQuery={setQuery} /> */}
          </Col>

          <Col md={4} xs={12}>
            {/* Future: stats / streak / activity */}
          </Col>
        </Row>
      </section>
    </div>
  );
}