import React from 'react';
import { FaHome, FaCar, FaBell } from 'react-icons/fa';
import './MobileNavigation.css';

const MobileNavigation = ({ active, setActive }) => {
  return (
    <nav className="mobile-nav">
      <button onClick={() => setActive('dashboard')} className={active==='dashboard'?'active':''}><FaHome /></button>
      <button onClick={() => setActive('jobs')} className={active==='jobs'?'active':''}><FaCar /></button>
      <button onClick={() => setActive('notifications')} className={active==='notifications'?'active':''}><FaBell /></button>
    </nav>
  );
};

export default MobileNavigation;
