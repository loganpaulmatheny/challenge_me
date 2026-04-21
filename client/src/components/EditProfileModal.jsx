import { useState } from "react";
import Modal from "./ui/Modal/Modal";
import Input from "./ui/Input/Input";
import Button from "./ui/Button/Button";
import DangerZoneModal from "./DeleteModal";
import PropTypes from "prop-types";

const fields = [
  { name: "username", label: "Username", type: "text" },
  { name: "name", label: "Name", type: "text" },
  { name: "profileImageURL", label: "Profile Image URL", type: "url" },
  { name: "bio", label: "Bio", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "state", label: "State", type: "text" },
];

export default function EditProfileModal({ user, onClose, onUserUpdate }) {
  const [form, setForm] = useState({
    username: user.username ?? "",
    name: user.name ?? "",
    profileImageURL: user.profileImageURL ?? "",
    bio: user.bio ?? "",
    city: user.city ?? "",
    state: user.state ?? "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDangerZone, setShowDangerZone] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Failed to update profile");
      }
      const updatedUser = await res.json();
      onUserUpdate && onUserUpdate(updatedUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" form="edit-profile-form" loading={loading}>
        Save Changes
      </Button>
    </>
  );

  return (
    <>
      <Modal title="Edit Profile" onClose={onClose} footer={footer}>
        {error && (
          <p className="edit-profile-error" role="alert">
            {error}
          </p>
        )}
        <form id="edit-profile-form" onSubmit={handleSubmit} className="edit-profile-form">
          {fields.map(({ name, label, type }) => (
            <Input
              key={name}
              id={name}
              label={label}
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
            />
          ))}
          <button
            type="button"
            className="edit-profile-danger-link"
            onClick={() => setShowDangerZone(true)}
          >
            Delete account
          </button>
        </form>
      </Modal>

      {showDangerZone && (
        <DangerZoneModal user={user} onClose={() => setShowDangerZone(false)} />
      )}
    </>
  );
}

EditProfileModal.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    username: PropTypes.string,
    name: PropTypes.string,
    profileImageURL: PropTypes.string,
    bio: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUserUpdate: PropTypes.func,
};
