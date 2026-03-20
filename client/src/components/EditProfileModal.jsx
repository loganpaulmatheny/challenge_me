import { useState } from "react";
import DangerZoneModal from "./DeleteModal";

const fields = [
  { name: "username", label: "Username", type: "text" },
  { name: "name", label: "Name", type: "text" },
  { name: "profileImageURL", label: "Profile Image URL", type: "url" },
  { name: "bio", label: "Bio", type: "textarea" },
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
      console.log({ form }, JSON.stringify(form));
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
      onUserUpdate(updatedUser) && onUserUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Profile</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              {fields.map(({ name, label, type }) => (
                <div className="mb-3" key={name}>
                  <label htmlFor={name} className="form-label">
                    {label}
                  </label>
                  {type === "textarea" ? (
                    <textarea
                      id={name}
                      name={name}
                      className="form-control"
                      value={form[name]}
                      onChange={handleChange}
                      rows={3}
                    />
                  ) : (
                    <input
                      id={name}
                      name={name}
                      type={type}
                      className="form-control"
                      value={form[name]}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}

              <div className="d-flex justify-content-between align-items-center mt-4">
                <button
                  type="button"
                  className="btn btn-link text-danger p-0"
                  onClick={() => {
                    setShowDangerZone(true);
                  }}
                >
                  Delete Account
                </button>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowDangerZone(true);
                      onClose();
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showDangerZone && (
        <DangerZoneModal user={user} onClose={() => setShowDangerZone(false)} />
      )}
    </div>
  );
}
