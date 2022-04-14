import React from 'react';
import { Reorder } from 'framer-motion/dist/framer-motion';
import EventItem from '../EventItem/EventItem';
import './EventList.scss';

export default function EventList({ events, onShowDetail, setEvents }) {
  return (
    <>
      <Reorder.Group axis="y" onReorder={setEvents} values={events} className="events__list">
        {events.map(event => (
          <EventItem key={event._id} event={event} onDetailPress={onShowDetail} />
        ))}
      </Reorder.Group>
    </>
  );
}
