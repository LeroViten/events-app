import React from 'react';
import './Spinner.scss';

export default function Spinner() {
  return (
    <div className="spinner">
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
