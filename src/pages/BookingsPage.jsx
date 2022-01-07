import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-hot-toast';
import Spinner from '../components/Spinner';
import AuthContext from '../context/auth-context';

export default function BookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
          query {
            bookings {
              _id
             createdAt
             event {
               _id
               title
               date
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
        Authorization: 'Bearer ' + context.token,
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          toast.error('Booking fetching failed!', {
            duration: 3000,
            icon: '😒',
            style: {
              border: '1px solid tomato',
              color: '#b00b69',
            },
          });
          throw new Error('Failed to fetch bookings!');
        }
        return res.json();
      })
      .then(resData => {
        const fetchedBookings = resData.data.bookings;
        setBookings(fetchedBookings);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <div>
      {isLoading && <Spinner />}
      {bookings && (
        <ul className="events__list">
          {bookings.map(booking => (
            <li key={booking._id} className="events__list--item">
              <h3>{booking.event.title}</h3>
              <p>{new Date(booking.createdAt).toLocaleDateString('en-US', dateOptions)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
