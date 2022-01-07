import React, { useContext } from 'react';
import AuthContext from '../../../context/auth-context';
import './EventItem.scss';

export default function EventItem({ event, onDetailPress }) {
  const context = useContext(AuthContext);
  return (
    <>
      <li className="events__list--item">
        <div>
          <h2>{event.title}</h2>
          <h3>
            ${event.price} - {new Date(event.date).toLocaleDateString()}
          </h3>
        </div>
        <div>
          {context.userId === event.creator._id ? (
            <p>You're the owner of this event.</p>
          ) : (
            <button className="btn" onClick={() => onDetailPress(event._id)}>
              View Details
            </button>
          )}
        </div>
      </li>
    </>
  );
}
