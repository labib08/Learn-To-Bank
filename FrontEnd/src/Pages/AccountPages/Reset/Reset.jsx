// reset.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../Assets/logo.png';
import './Reset.css';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            alert('Password reset successful! You can now log in.');
            navigate('/login'); // Redirect to login
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="otp">
            <div className="otp-container">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <h1>Reset Password</h1>
                <div className="otp-text">
                    <h3>Enter your new password below.</h3>
                </div>
                <div className="enter-otp">
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="resend-otp-container">
                    <button onClick={handleResetPassword}>Reset Password</button>
                    {error && <p className="error">{error}</p>}
                </div>
            </div>
        </div>
    );
}
