import { useState, useEffect, useCallback } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// import VotingList from "../components/VotingList.jsx";
// import ApartmentListingsList from "../components/ApartmentListingsList.jsx";
// import CreateListingForm from "../components/CreateListingForm.jsx";

import UserList from "../components/UserList.jsx"
import ProfileInfo from "../components/ProfileInfo.jsx"

export default function IndexPage() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      // Send a get request for the current user
      // We send the credentials becuase it'll send the cookie
      const res = await fetch('/api/auth/user', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    };
    fetchUser();
  }, []); // The empty dependency means that this should fetch the user ONLY ONCE on page load

  // TODO: This is all boilerplate from class, consider removal
  const reloadUsers = useCallback(async () => {
    const res = await fetch(`/api/users?q=${query}`);
    if (!res.ok) {
      console.error("Failed to fetch users:", res.statusText);
      return;
    }
    const data = await res.json();
    setUsers(data.users);
  }, [query]);

  useEffect(() => {
    const timeout = setTimeout(reloadUsers, 300); // Debounce for 300ms

    // Cleanup function to clear the timeout if query changes before timeout completes
    return () => {
      console.log("Fetching effect cleanup");
      clearTimeout(timeout);
    };
  }, [reloadUsers, query]);

  return (
    <>
      <h1>Index Page</h1>
      <ProfileInfo user={user} />
      <section>
        <Row>
          <Col md={8} xs={12}>
            <UserList
              users={users}
              query={query}
              setQuery={setQuery}
            />
          </Col>
          <Col md={4} xs={12}>
          </Col>
        </Row>
      </section>
    </>
  );
}

