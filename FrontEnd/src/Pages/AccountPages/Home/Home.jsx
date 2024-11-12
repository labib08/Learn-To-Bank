import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home({onClickDiv}) {
  const [accountData, setAccountData] = useState(null)
  const flag = false;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedData = localStorage.getItem('accountData');
      if (storedData) {
        setAccountData(JSON.parse(storedData)); // Update accountData with localStorage data
        clearInterval(intervalId); // Stop the interval once the data is found
      }
    }, 5); // Check every second (1000ms)

    // Cleanup interval if the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const getDay = (date) => {
    const dayIndex = date.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
  };

  return (
    <div className="home">
      <div className='home-greeting'>
        <div className='home-greeting-message'>
          {flag}
          <p>Happy {getDay(new Date())} {accountData ? accountData.name : 'User'}</p>
        </div>
        <div className='home-greeting-empty'>
        </div>
        </div>
      <div className='home-box'>
        <div className='home-box-top'>
          <div className='home-box-left'>
            <h1>Savings home</h1>
            <p className='home-box-left-info-p'>BSB: {accountData ? accountData.bsb : ''}</p>
            <p className='home-box-left-info-p'>Account Number: {accountData ? accountData.accNo : ''}</p>
            <p className='home-box-left-view-p'>
            <Link to="/view" onClick={() => onClickDiv("Savings Account")}>View Account History</Link>
          </p>
          </div>
          <div className='home-box-right'>
          <h2>Balance</h2>
          <p className='home-box-left-info-p'>{accountData ? "$" + accountData.savingAccDetails.balance : ''}</p>
          </div>
        </div>
        <div className='home-box-bottom'>
          <div className='home-box-left'>
          <h1>Transaction Account</h1>
          <p className='home-box-left-info-p'>BSB: {accountData ? accountData.bsb : ''}</p>
          <p className='home-box-left-info-p'>Account Number: {accountData ? accountData.accNo : ''}</p>
          <p className='home-box-left-view-p'>
            <Link to="/view" onClick={() => onClickDiv("Transactions Account")}>View Account History</Link>
          </p>
          </div>
          <div className='home-box-right'>
            <h2>Balance</h2>
            <p className='home-box-left-info-p'>{accountData ? "$" + accountData.transAccDetails.balance : ''}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
