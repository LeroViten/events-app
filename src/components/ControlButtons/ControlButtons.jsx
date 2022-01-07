import React from 'react';
import './ControlButtons.scss';

export default function ControlButtons({ outputHandler, outputType }) {
  return (
    <div className="bookings-control">
      <button
        className={outputType === 'list' ? 'active' : ''}
        onClick={() => outputHandler('list')}
      >
        List
      </button>
      <button
        className={outputType === 'chart' ? 'active' : ''}
        onClick={() => outputHandler('chart')}
      >
        Chart
      </button>
    </div>
  );
}
