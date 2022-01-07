import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import { toast } from 'react-hot-toast';
import AuthContext from '../context/auth-context';
import Modal from '../components/Modal/Modal';
import Spinner from '../components/Spinner';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import './EventsPage.scss';

const eventState = {
  title: '',
  price: 0,
  date: '',
  description: '',
};

export default function EventsPage() {
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [values, setValues] = useState(eventState);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useLayoutEffect(() => {
    return () => {
      setIsActive(false);
    };
  }, []);

  const context = useContext(AuthContext);

  const handleChange = event => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const startCreateEvent = () => {
    setCreatingEvent(true);
  };

  const modalConfirmHandler = () => {
    setCreatingEvent(false);
    setLoading(true);
    const { title, price, date, description } = values;
    if (
      title.trim().length === 0 ||
      price.trim().length === 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      toast.error('All the fields are required!', {
        duration: 3000,
        icon: '🤷‍♂️',
        style: {
          border: '1px solid tomato',
          color: '#b00b69',
        },
      });
      return;
    }

    const bodyData = {
      query: `
          mutation{
            createEvent(eventInput:{title:"${title}", price: "${price}", date:"${date}", description: "${description}"}) {
              _id
              title
              description
              date
              price
            }
          }
        `,
    };

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(bodyData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + context.token,
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          toast.error('Adding event failed!', {
            duration: 3000,
            icon: '😒',
            style: {
              border: '1px solid tomato',
              color: '#b00b69',
            },
          });
          throw new Error('Failed to add an event');
        }
        return res.json();
      })
      .then(resData => {
        const newEvent = {
          _id: resData.data.createEvent._id,
          title: resData.data.createEvent.title,
          description: resData.data.createEvent.description,
          date: resData.data.createEvent.date,
          price: resData.data.createEvent.price,
          creator: {
            _id: context.userId,
          },
        };
        setEvents(prev => [newEvent, ...prev]);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
    setValues(eventState);
  };

  const modalCancelHandler = () => {
    setCreatingEvent(false);
    setSelectedEvent(null);
  };

  const backdropClickHandler = () => {
    setCreatingEvent(false);
    setSelectedEvent(null);
  };

  const fetchEvents = () => {
    setLoading(true);
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `,
    };

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          toast.error('Fetching events failed!', {
            duration: 3000,
            icon: '😒',
            style: {
              border: '1px solid tomato',
              color: '#b00b69',
            },
          });
          throw new Error('Failed to fetch events!');
        }
        return res.json();
      })
      .then(resData => {
        if (isActive) {
          const events = resData.data.events;
          setEvents(events);
          setLoading(false);
        }
      })
      .catch(error => {
        console.log(error);
        if (isActive) {
          setLoading(false);
        }
      });
  };

  const showDetailHandler = eventId => {
    const exactEvent = events.find(event => event._id === eventId);
    setSelectedEvent(exactEvent);
  };

  const onBookEvent = () => {
    if (!context.token) {
      setSelectedEvent(null);
      return;
    }

    setLoading(true);

    const requestBody = {
      query: `
          mutation {
            bookEvent(eventId: "${selectedEvent._id}") {
              _id
             createdAt
             updatedAt
            }
          }
        `,
    };

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + context.token,
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          toast.error('Booking failed!', {
            duration: 3000,
            icon: '😒',
            style: {
              border: '1px solid tomato',
              color: '#b00b69',
            },
          });
          throw new Error('Failed to book the event!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        setSelectedEvent(null);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <>
      {creatingEvent && <Backdrop onToggle={backdropClickHandler} />}
      {creatingEvent && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={values.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={values.price}
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={values.date}
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                name="description"
                value={values.description}
                onChange={handleChange}
              />
            </div>
          </form>
        </Modal>
      )}

      {selectedEvent && <Backdrop onToggle={backdropClickHandler} />}
      {selectedEvent && (
        <Modal
          title={selectedEvent?.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={onBookEvent}
          confirmText={context.token ? 'Book' : 'Confirm'}
        >
          <div className="wrapper">
            <b>Description: {selectedEvent?.description}</b>
            <p style={{ color: '#505050', marginBottom: '5px' }}> Price: ${selectedEvent?.price}</p>
            <p>Date: {new Date(selectedEvent?.date).toLocaleDateString('en-US', dateOptions)}</p>
          </div>
        </Modal>
      )}

      {context.token && (
        <div className="eventsContainer">
          <p>Create your own Event!</p>
          <button className="btn" onClick={startCreateEvent}>
            Create Event
          </button>
        </div>
      )}
      {loading && <Spinner />}
      <EventList events={events} onShowDetail={showDetailHandler} />
    </>
  );
}
