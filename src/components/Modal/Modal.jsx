import React, { useContext } from 'react';
import AuthContext from '../../context/auth-context';
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
  const context = useContext(AuthContext);
  return (
    <div className="modal">
      <header className="modal__header">
        <h1>{title}</h1>
      </header>
      <section className="modal__content">{children}</section>
      <section className="modal__actions">
        {canConfirm && (
          <button className="btn" onClick={onConfirm} disabled={!context.token}>
            {!context.token ? 'Login first' : confirmText}
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
