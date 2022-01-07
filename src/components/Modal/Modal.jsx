import React from 'react';
import './Modal.scss';

export default function Modal({
  children,
  title,
  canCancel,
  canConfirm,
  onCancel,
  onConfirm,
  confirmText,
}) {
  return (
    <div className="modal">
      <header className="modal__header">
        <h1>{title}</h1>
      </header>
      <section className="modal__content">{children}</section>
      <section className="modal__actions">
        {canConfirm && (
          <button className="btn" onClick={onConfirm}>
            {confirmText}
          </button>
        )}
        {canCancel && (
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </section>
    </div>
  );
}
