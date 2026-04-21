import { useEffect, useRef, useCallback } from "react";
import "./Modal.css";
import PropTypes from "prop-types";

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export default function Modal({ title, children, onClose, footer, size = "md" }) {
  const boxRef  = useRef(null);
  const titleId = "ci-modal-title";

  /* Focus the dialog box on mount, restore on unmount */
  useEffect(() => {
    const prev = document.activeElement;
    boxRef.current?.focus();
    return () => prev?.focus();
  }, []);

  /* Focus trap */
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key !== "Tab") return;

    const els = Array.from(boxRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (els.length === 0) return;

    const first = els[0];
    const last  = els[els.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  }, [onClose]);

  return (
    <div
      className="ci-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={boxRef}
        className={`ci-modal-box ci-modal-box-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {title && (
          <div className="ci-modal-header">
            <h2 id={titleId} className="ci-modal-title">
              {title}
            </h2>
            <button
              className="ci-modal-close"
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>
        )}

        <div className="ci-modal-body">{children}</div>

        {footer && <div className="ci-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};
