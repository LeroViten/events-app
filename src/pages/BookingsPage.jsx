import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { toast } from 'react-hot-toast';
import AuthContext from '../context/auth-context';
import BookingList from '../components/BookingList/BookingList';
import Spinner from '../components/Spinner';

export default function BookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const context = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
  }, []);

  useLayoutEffect(() => {
    return () => {
      setIsActive(false);
    };
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
        if (isActive) {
          const fetchedBookings = resData.data.bookings;
          setBookings(fetchedBookings);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.log(error);
        if (isActive) {
          setIsLoading(false);
        }
      });
  };

  const cancelBookingHandler = bookingId => {
    setIsLoading(true);
    const requestBody = {
      query: `
          mutation {
            cancelBooking(bookingId: "${bookingId}") {
            _id
             title
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
          toast.error('Cancelling booking failed!', {
            duration: 3000,
            icon: '😒',
            style: {
              border: '1px solid tomato',
              color: '#b00b69',
            },
          });
          throw new Error('Failed to cancel the booking!');
        }
        return res.json();
      })
      .then(resData => {
        const updatedBookings = bookings.filter(booking => {
          return booking._id !== bookingId;
        });
        setBookings(updatedBookings);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <div>
      {isLoading && <Spinner />}
      {bookings && <BookingList bookings={bookings} onCancel={cancelBookingHandler} />}
    </div>
  );
}
