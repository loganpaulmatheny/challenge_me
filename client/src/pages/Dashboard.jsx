import { useState, useEffect, useCallback } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// import VotingList from "../components/VotingList.jsx";
// import ApartmentListingsList from "../components/ApartmentListingsList.jsx";
// import CreateListingForm from "../components/CreateListingForm.jsx";

import UserList from "../components/UserList.jsx"


export default function IndexPage() {
  const [users, setUsers] = useState(null);
  const [query, setQuery] = useState("");

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

