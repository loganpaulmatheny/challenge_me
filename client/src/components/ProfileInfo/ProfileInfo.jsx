import { useState } from "react";
import Avatar from "../ui/Avatar/Avatar";
import Button from "../ui/Button/Button";
import EditProfileModal from "../EditProfileModal";
import "./ProfileInfo.css";
import PropTypes from "prop-types";

export default function ProfileInfo({ user, onUserUpdate }) {
  const [showModal, setShowModal] = useState(false);

  if (!user) return <p className="profile-info-loading">Loading...</p>;

  return (
    <div className="profile-info">
      <div className="profile-info-avatar-wrap">
        <Avatar
          src={user.profileImageURL}
          username={user.username || "?"}
          size={80}
        />
        <div className="profile-info-meta">
          <h3 className="profile-info-username">{user.username}</h3>
          <p className="profile-info-email">{user.email}</p>
        </div>
      </div>

      <Button variant="soft" size="sm" onClick={() => setShowModal(true)}>
        Edit Profile
      </Button>

      {showModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowModal(false)}
          onUserUpdate={() => {
            onUserUpdate && onUserUpdate();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

ProfileInfo.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    profileImageURL: PropTypes.string,
  }),
  onUserUpdate: PropTypes.func,
};
