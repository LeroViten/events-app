import React from 'react';
import './BookingList.scss';

export default function BookingList({ bookings, onCancel }) {
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <>
      <ul className="bookings__list">
        {bookings.map(booking => (
          <li key={booking._id} className="bookings__item">
            <div className="bookings__item--data">
              <h3>{booking.event.title}</h3>
              <p>{new Date(booking.createdAt).toLocaleDateString('en-US', dateOptions)}</p>
            </div>
            <div className="bookings__item--actions">
              <button className="btn" onClick={() => onCancel(booking._id)}>
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
