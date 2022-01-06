import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AuthContext from '../context/auth-context';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './EventsPage.scss';

const eventState = {
  title: '',
  price: 0,
  date: '',
  description: '',
};

export default function EventsPage() {
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [values, setValues] = useState(eventState);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
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
    const { title, price, date, description } = values;
    if (
      title.trim().length === 0 ||
      price.trim().length === 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      toast.error('All fields are required!', {
        duration: 3000,
        icon: '🤷‍♂️',
        style: {
          border: '1px solid tomato',
          color: '#b00b69',
        },
      });
      return;
    }

    // const newEvent = { title, price, date, description };

    const bodyData = {
      query: `
          mutation{
            createEvent(eventInput:{title:"${title}", price: "${price}", date:"${date}", description: "${description}"}) {
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
        console.log('resData :>> ', resData);
        fetchEvents();
      })
      .catch(error => {
        console.log(error);
      });
    setValues(eventState);
  };

  const modalCancelHandler = () => {
    setCreatingEvent(false);
  };

  const backdropClickHandler = () => {
    setCreatingEvent(false);
  };

  const fetchEvents = () => {
    const requestBody = {
      query: `
          query {
            events {
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
        const events = resData.data.events;
        setEvents(events);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <>
      {creatingEvent && <Backdrop onToggle={backdropClickHandler} />}
      {creatingEvent && (
        <Modal title="Add Event" canCancel={modalCancelHandler} canConfirm={modalConfirmHandler}>
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
      {context.token && (
        <div className="eventsContainer">
          <p>Create your own Event!</p>
          <button className="btn" onClick={startCreateEvent}>
            Create Event
          </button>
        </div>
      )}
      <ul className="events__list">
        {events.map(({ _id, title, description, price, date }) => (
          <li key={_id} className="events__list--item">
            <h4>{title}</h4>
            <p>{price}</p>
            <p>{date}</p>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
