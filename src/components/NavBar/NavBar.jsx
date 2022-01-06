import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.scss';

export default function NavBar() {
  return (
    <>
      <header className="main-navigation">
        <div className="main-navigation__logo">
          <h1>EventHub</h1>
        </div>
        <nav className="main-navigation__items">
          <ul>
            <li>
              <NavLink to="/auth">Authentication</NavLink>
            </li>
            <li>
              <NavLink to="/events">Events</NavLink>
            </li>
            <li>
              <NavLink to="/bookings">Bookings</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
