import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../Assets/logo.png';
import logoff from '../../Assets/logoff-icon.png';
import navToggle from '../../Assets/navbar-toggle.png';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const [page, setPage] = useState(localStorage.getItem('activePage') || 'home');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const section = useRef();
  const token = localStorage.getItem('authToken');
  const [accountData, setAccountData] = useState(() => {
    const storedData = localStorage.getItem('accountData');
    return storedData ? JSON.parse(storedData) : null;
  });

  const onClickPage = (currPage) => {
    setPage(currPage);
    localStorage.setItem('activePage', currPage);
  };

  const getAccountData = useCallback(async () => {
    try {
      // Make a request to get the user account details
      const response = await axios.post('https://learn-to-bank-backend-7mtr.onrender.com/api/accounts/getUser', {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
      });

      setAccountData(response.data); // Set the account data received from backend
      localStorage.setItem('accountData', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching account details:', error);
    }
  }, [token]);

  useEffect(() => {
    const path = location.pathname.replace('/', '');
    setPage(path || 'home'); // Default to 'home' if path is empty
    // Optionally persist the page in localStorage for future sessions
    localStorage.setItem('activePage', path || 'home');

    const storedPage = localStorage.getItem('activePage');
    if (storedPage) {
      setPage(storedPage);
    }
    // Check if the user has admin properties
    if (accountData && accountData.role === 'admin') {
      setIsAdmin(true);
    }
    else {
      setIsAdmin(false);
    }

  }, [location, accountData]);

  useEffect(() => {
    getAccountData();
}, [getAccountData]);

  const setHrTag = (currPage) => {
    if (page === currPage) {
        return <hr/>;
    }
    return null;
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  }

  const dropdown = (e) => {
    section.current.classList.toggle('navbar-section-visible');
    e.target.classList.toggle('open');
  }

  return (
    <div className='navbar'>
        <div className='navbar-logo'>
            <img src={logo} alt="" />
            <p className='navbar-bank-title'>Learn to Bank</p>
            <p className='navbar-bank-slogan'>Where Money Pretends To Grow!</p>
        </div>
        <img className='navbar-dropdown' onClick={dropdown} src={navToggle} alt=''/>
        <ul ref={section} className='navbar-section'>
            <li onClick={() => onClickPage('home')}> <Link to="/home" className='navbar-link'>Home</Link>{setHrTag("home")}</li>
            <li onClick={() => onClickPage('view')}> <Link to="/view" className='navbar-link'>View Accounts</Link>{setHrTag("view")}</li>
            <li onClick={() => onClickPage('contacts')}> <Link to="/contacts" className='navbar-link'>Contacts</Link>{setHrTag("contacts")}</li>
            <li onClick={() => onClickPage('transfer')}> <Link to="/transfer" className='navbar-link'>Transfer</Link>{setHrTag("transfer")}</li>
            <li onClick={() => onClickPage('settings')}> <Link to="/settings" className='navbar-link'>Settings</Link>{setHrTag("settings")}</li>
            {isAdmin && <li onClick={() => onClickPage('adminpanel')}> <Link to="/adminpanel" className='navbar-link'>Admin Panel</Link>{setHrTag("adminpanel")}</li>}
        </ul>
        <div className='navbar-logoff'>
            <button onClick={handleLogout}>
                <img src={logoff} alt=""/>
                Log off
            </button>
        </div>
    </div>
  )
}
