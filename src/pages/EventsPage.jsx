import React, { useState } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './EventsPage.scss';

export default function EventsPage() {
  const [creatingEvent, setCreatingEvent] = useState(false);

  const createEvent = () => {
    setCreatingEvent(true);
  };

  const modalConfirmHandler = () => {
    setCreatingEvent(false);
  };

  const modalCancelHandler = () => {
    setCreatingEvent(false);
  };

  const backdropClickHandler = () => {
    setCreatingEvent(false);
  };

  return (
    <>
      {creatingEvent && <Backdrop onToggle={backdropClickHandler} />}
      {creatingEvent && (
        <Modal title="Add Event" canCancel={modalCancelHandler} canConfirm={modalConfirmHandler}>
          <p>CONTENT</p>
        </Modal>
      )}
      <div className="eventsContainer">
        <p>Create your own Event!</p>
        <button className="btn" onClick={createEvent}>
          Create Event
        </button>
      </div>
    </>
  );
}
