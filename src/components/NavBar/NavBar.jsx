import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.scss';
import AuthContext from '../../context/auth-context';

const NavBar = () => {
  const context = useContext(AuthContext);

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EventHub</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          {!context.token && (
            <li>
              <NavLink to="/auth">Authentication</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {context.token && (
            <>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button type="button" onClick={context.logout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};
export default NavBar;
