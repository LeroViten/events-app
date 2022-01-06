import React, { useState, lazy, Suspense } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/AuthPage';
import NavBar from './components/NavBar/NavBar';
import AuthContext from './context/auth-context';
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
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
  };
  return (
    <>
      <AuthContext.Provider value={{ token, userId, login, logout }}>
        <NavBar />
        <Suspense
          fallback={
            <Loader className="Loader" type="Puff" color="#6667AB" height={100} width={100} />
          }
        >
          <main className="main-content">
            <Switch>
              {!token && <Redirect from="/" to={'/auth'} exact />}
              {token && <Redirect from="/" to={'/events'} exact />}
              {token && <Redirect from="/auth" to={'/events'} exact />}
              {!token && <Route exact path="/auth" component={AuthPage} />}
              <Route exact path="/events" component={EventsPage} />
              {token && <Route exact path="/bookings" component={BookingsPage} />}
              <Route component={NotFoundPage} />
            </Switch>
          </main>
        </Suspense>
      </AuthContext.Provider>
      <div>
        <Toaster position="top-center" />
      </div>
    </>
  );
}
