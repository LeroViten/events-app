import React from 'react';
import EventItem from '../EventItem/EventItem';
import './EventList.scss';

export default function EventList({ events, onShowDetail }) {
  return (
    <>
      <ul className="events__list">
        {events.map(event => (
          <EventItem key={event._id} event={event} onDetailPress={onShowDetail} />
        ))}
      </ul>
    </>
  );
}
