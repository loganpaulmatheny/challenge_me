import { useNavigate } from "react-router-dom";
import Modal from "./ui/Modal/Modal";
import Button from "./ui/Button/Button";
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

  const footer = (
    <>
      <Button variant="ghost" type="button" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="terra" type="button" onClick={handleDelete}>
        Yes, delete my account
      </Button>
    </>
  );

  return (
    <Modal title="Are you absolutely sure?" onClose={onClose} footer={footer}>
      <p className="danger-zone-body">
        This action cannot be undone. Your account and all associated data will
        be permanently removed from our servers.
      </p>
    </Modal>
  );
};

DangerZoneModal.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DangerZoneModal;
