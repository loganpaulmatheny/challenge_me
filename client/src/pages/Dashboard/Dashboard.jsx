import { useState, useEffect, useCallback } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import UserList from "../../components/UserList.jsx";
import { useUser } from "../../context/UserContext";
import ChallengeCard from "../../components/ui/ChallengeCard/ChallengeCard";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo.jsx";

export default function Dashboard() {
  const { user, profile } = useUser();
  const [users, setUsers] = useState(null);
  const [query, setQuery] = useState("");


  // // FETCH CURRENT USER
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const res = await fetch("/api/auth/user", {
  //       credentials: "include",
  //     });

  //     if (res.ok) {
  //       const data = await res.json();
  //       setUser(data.user);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  // // FETCH USERS (optional / can remove later)
  // const reloadUsers = useCallback(async () => {
  //   try {
  //     const res = await fetch(`/api/users?q=${query}`);
  //     if (!res.ok) return;

  //     const data = await res.json();
  //     setUsers(data.users);
  //   } catch (err) {
  //     console.error("Failed to fetch users", err);
  //   }
  // }, [query]);

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
      <ProfileInfo user={user} onUserUpdate={() => {}} />

      {/* MAIN CONTENT */}
      <section>
  <Row>
    <Col md={12}>
      <h4 style={{ marginBottom: 12 }}>Your Challenges</h4>

      <div className="feed-grid">
        {profile?.savedChallenges?.map((c, i) => (
          <ChallengeCard
            key={i}
            challenge={{
              _id: c.challengeId,
              title: "Saved Challenge",
              description: "Continue your progress",
              category: "",
              neighborhood: "",
              timeWindow: "",
              stats: {},
              creator: {},
              saved: true,
              liked: false,
            }}
            onImport={() => {}}
          />
        ))}
      </div>
    </Col>
  </Row>
</section>
    </div>
  );
}