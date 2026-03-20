import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const DangerZoneModal = ({ user, onClose }) => {
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Failed to delete account");
      }

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal show onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you absolutely sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: "red" }}>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

DangerZoneModal.propTypes = {
  user: PropTypes.shape.any,
  onClose: PropTypes.func,
};

export default DangerZoneModal;
