import React from 'react';
import { Link } from 'react-router-dom';
import './EditProfile.css';

export default function EditProfile() {
    return (
        <div className="edit-profile">
            <div className="edit-profile-container">
                <h1>Edit Profile</h1>
                <div className="edit-fields">
                    <p>Update Username:</p>
                    <input type="text" className="edit-username" placeholder="New username" />
                    <p>Update Name:</p>
                    <input type="text" className="edit-name" placeholder="New name"/>
                    <p>Update Email:</p>
                    <input type="text" className="edit-email" placeholder="New email"/>
                    <input type="text" className="confirm-new-password" placeholder="Confirm new email"/>
                    <Link to="/view"><button className="confirm-edits">Continue</button></Link>
                    <div className="confirm-accounts">
                        <Link to = "/view" className='edit-account-link'> Back to Accounts</Link>
                    </div>

                </div>
            </div>
        </div>
    )
}