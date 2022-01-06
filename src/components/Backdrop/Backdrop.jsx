import React, { useEffect } from 'react';
import './Backdrop.scss';

export default function Backdrop({ onToggle }) {
  // custom add/remove event listener for keydown:
  useEffect(function setUpListener() {
    window.addEventListener('keydown', handleKeyDown);
    function handleKeyDown(event) {
      if (event.code === 'Escape') {
        onToggle();
      }
    }

    return function cleanUpKeyDown() {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      onToggle();
    }
  };
  return <div className="backdrop" onClick={handleBackdropClick}></div>;
}
