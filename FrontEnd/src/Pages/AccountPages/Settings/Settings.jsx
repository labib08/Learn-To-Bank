import React, { useContext } from 'react';
import { InstructionsContext } from '../../../InstructionsContext';
import './Settings.css';


export default function Settings() {
  const { instructionsMode, setInstructionsMode } = useContext(InstructionsContext);

  const handleToggle = () => {
    setInstructionsMode(!instructionsMode);
  };

  const handleResetPassword = () => {
    alert('Password Reset link has been sent to your email.');
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <p>Settings</p>
      </div>
      <div className="settings-container">
        <div className="instructions-toggle">
          <p>Instructions Mode:</p>
          <label>
            <input
              type="checkbox"
              checked={instructionsMode}
              onChange={handleToggle}
              className="instructions-toggle-switch"
            />
            <span className="instructions-slider"></span>
          </label>
        </div>
        <div className="reset-password-setting">
          <p>Password Management:</p>
          <button className="reset-button" onClick={handleResetPassword}>Reset Password</button>
        </div>
        <div className="reset-password-setting">
          <p>Delete Account</p>
          <button className="reset-button" onClick={handleResetPassword}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}
