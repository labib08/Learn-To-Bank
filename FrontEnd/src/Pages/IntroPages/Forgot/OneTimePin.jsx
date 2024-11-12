// onetimepin.jsx
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../Assets/logo.png';
import './OneTimePin.css';

export default function OneTimePin() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleConfirmOTP = async () => {
        try {
            alert('OTP verified! You can now reset your password.');
            navigate('/reset'); // Redirect to Reset Password page
        } catch (err) {
            setError('Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="otp">
            <div className="otp-container">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <h1>Reset Password PIN</h1>
                <div className="otp-text">
                    <h3>Please enter the One Time PIN sent to your email.</h3>
                </div>
                <div className="enter-otp">
                    <input
                        type="text"
                        placeholder="Enter OTP here."
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </div>
                <div className="resend-otp-container">
                    <button onClick={handleConfirmOTP}>Confirm</button>
                    {error && <p className="error">{error}</p>}
                    <p className="resend-otp">
                        Did not receive email? <span>Click here.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
