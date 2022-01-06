import React, { lazy, Suspense } from 'react';
import Loader from 'react-loader-spinner';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/AuthPage';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

// lazy-loading pages:

const BookingsPage = lazy(() =>
  import('./pages/BookingsPage' /* webpackChunkName: "bookings-page" */),
);
const EventsPage = lazy(() => import('./pages/EventsPage' /* webpackChunkName: "events-page" */));
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage' /* webpackChunkName: "notFound-page" */),
);

export default function App() {
  return (
    <>
      <Router>
        <Suspense
          fallback={
            <Loader className="Loader" type="Puff" color="#77d5f1" height={100} width={100} />
          }
        >
          <Switch>
            <Redirect from="/" to={'/auth'} exact />
            <Route exact path="/auth" component={AuthPage} />
            <Route exact path="/events" component={EventsPage} />
            <Route exact path="/bookings" component={BookingsPage} />
            <Route exact path="*" component={NotFoundPage} />
          </Switch>
        </Suspense>
      </Router>
      <div>
        <Toaster position="top-center" />
      </div>
    </>
  );
}
