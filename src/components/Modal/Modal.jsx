import React from 'react';
import './Modal.scss';

export default function Modal({ children, title, canCancel, canConfirm }) {
  return (
    <div className="modal">
      <header className="modal__header">
        <h1>{title}</h1>
      </header>
      <section className="modal__content">{children}</section>
      <section className="modal__actions">
        {canConfirm && (
          <button className="btn" onClick={canConfirm}>
            Confirm
          </button>
        )}
        {canCancel && (
          <button className="btn" onClick={canCancel}>
            Cancel
          </button>
        )}
      </section>
    </div>
  );
}
