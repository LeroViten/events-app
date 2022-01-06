import React, { lazy, Suspense } from 'react';
import Loader from 'react-loader-spinner';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/AuthPage';
import NavBar from './components/NavBar/NavBar';
import { Route, Redirect, Switch } from 'react-router-dom';
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
      <NavBar />
      <Suspense
        fallback={
          <Loader className="Loader" type="Puff" color="#6667AB" height={100} width={100} />
        }
      >
        <main className="main-content">
          <Switch>
            <Redirect from="/" to={'/auth'} exact />
            <Route exact path="/auth" component={AuthPage} />
            <Route exact path="/events" component={EventsPage} />
            <Route exact path="/bookings" component={BookingsPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </main>
      </Suspense>
      <div>
        <Toaster position="top-center" />
      </div>
    </>
  );
}
