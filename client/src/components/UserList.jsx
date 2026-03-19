import { useState, useEffect } from "react";

import User from "./User.jsx";

export default function UserList({ users, query, setQuery }) {
  function renderUsers(user) {
    return (
      < User key={user._id} id={user._id} username={user.username} />  // pass the props, and use _id not id)
    );
  }

  const onQuery = (evt) => {
    console.log(" onQuery", evt.target.value);
    setQuery(evt.target.value);
  };

  return (
    <div>
      <h2>Users</h2>
      <input
        value={query}
        onChange={onQuery}
        placeholder="Filter users..."
      />
      {users === null ? (
        <div>Loading users...</div>
      ) : users.length === 0 ? (
        <div>No users found.</div>
      ) : (
        users.map(renderUsers)
      )}
    </div>
  );
}

