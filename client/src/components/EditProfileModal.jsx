import { useState } from "react";
import Modal from "./ui/Modal/Modal";
import Input from "./ui/Input/Input";
import Button from "./ui/Button/Button";
import DangerZoneModal from "./DeleteModal";
import { useToast } from "../context/ToastContext";
import PropTypes from "prop-types";

const fields = [
  {
    name: "username",
    label: "Username",
    type: "text",
    required: true,
    hint: "Letters, numbers, and underscores only. Visible to other users.",
    placeholder: "e.g. explorer_boston",
  },
  {
    name: "name",
    label: "Display Name",
    type: "text",
    required: false,
    hint: "Your real name or nickname shown on your profile.",
    placeholder: "e.g. Alex Rivera",
  },
  {
    name: "profileImageURL",
    label: "Profile Image URL",
    type: "url",
    required: false,
    hint: "Paste a direct link to a profile photo (JPG, PNG).",
    placeholder: "https://example.com/my-photo.jpg",
  },
  {
    name: "bio",
    label: "Bio",
    type: "text",
    required: false,
    hint: "A short sentence about yourself.",
    placeholder: "e.g. Boston explorer, coffee enthusiast",
  },
  {
    name: "city",
    label: "City",
    type: "text",
    required: false,
    hint: "Your city helps surface local challenges.",
    placeholder: "e.g. Boston",
  },
  {
    name: "state",
    label: "State",
    type: "text",
    required: false,
    hint: "Two-letter state code.",
    placeholder: "e.g. MA",
  },
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
  const toast = useToast();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim()) {
      setError("Username is required.");
      return;
    }
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
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? `Save failed (${res.status})`);
      }
      const updatedUser = await res.json();
      onUserUpdate && onUserUpdate(updatedUser);
      toast.success("Your profile has been updated", "Profile Saved");
      onClose();
    } catch (err) {
      setError(err.message);
      toast.error(err.message, "Save Failed");
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
        <form id="edit-profile-form" onSubmit={handleSubmit} className="edit-profile-form" noValidate>
          {fields.map(({ name, label, type, required, hint, placeholder }) => (
            <Input
              key={name}
              id={name}
              label={`${label}${required ? " *" : ""}`}
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              hint={hint}
              placeholder={placeholder}
              required={required}
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
    _id: PropTypes.string.isRequired,
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
