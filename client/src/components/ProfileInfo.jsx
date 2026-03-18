import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

export default function ProfileInfo({ user, onUserUpdate }) {
  const [showModal, setShowModal] = useState(false);

  if (!user) return <p>Loading...</p>;

  const initials = user.username?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <>
      <div className="d-flex flex-column align-items-center mb-4">
        {user.profileImageURL ? (
          <img
            src={user.profileImageURL}
            alt={user.username}
            className="rounded-circle mb-2"
            style={{ width: 80, height: 80, objectFit: "cover" }}
          />
        ) : (
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-2"
            style={{ width: 80, height: 80, fontSize: 28, fontWeight: "bold" }}
          >
            {initials}
          </div>
        )}
        <h5 className="mb-0">{user.username}</h5>
        <p className="text-muted small">{user.email}</p>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setShowModal(true)}
        >
          Edit Profile
        </button>
      </div>

      {showModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowModal(false)}
          onUserUpdate={(updatedUser) => {
            onUserUpdate(updatedUser);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
