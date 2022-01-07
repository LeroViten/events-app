import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { toast } from 'react-hot-toast';
import ControlButtons from '../components/ControlButtons/ControlButtons';
import AuthContext from '../context/auth-context';
import BookingsChart from '../components/BookingsChart/BookingsChart';
import BookingList from '../components/BookingList/BookingList';
import Spinner from '../components/Spinner';

export default function BookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [outputType, setOutputType] = useState('list');
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
               price
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
          mutation CancelBooking($id: ID!) {
            cancelBooking(bookingId: $id) {
            _id
             title
            }
          }
        `,
      variables: {
        id: bookingId,
      },
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

  const renderOutputHandler = outputType => {
    if (outputType === 'list') {
      setOutputType('list');
    } else {
      setOutputType('chart');
    }
  };

  return (
    <>
      {isLoading && <Spinner />}
      <ControlButtons outputHandler={renderOutputHandler} outputType={outputType} />
      {bookings && outputType === 'list' ? (
        <BookingList bookings={bookings} onCancel={cancelBookingHandler} />
      ) : (
        <BookingsChart bookings={bookings} />
      )}
    </>
  );
}
