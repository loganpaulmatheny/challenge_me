import { useEffect, useRef } from "react";
import "./Modal.css";
import PropTypes from "prop-types";

export default function Modal({ title, children, onClose, footer }) {
  const boxRef = useRef(null);
  const titleId = "modal-title";

  useEffect(() => {
    boxRef.current?.focus();
    const prev = document.activeElement;
    return () => prev?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={boxRef}
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {title && (
          <div className="modal-header">
            <h2 id={titleId} className="modal-title">
              {title}
            </h2>
            <button
              className="modal-close"
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>
        )}

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  footer: PropTypes.node,
};
