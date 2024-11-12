import React from 'react';
import AdminAccountTable from './AdminAccountTable';
import './AdminPanel.css';

export default function AdminPanel() {
    return (
        <div className="settings">
            <div className="settings-header">
                <p>Admin Panel</p>
            </div>
            <div className="settings-container">
                <AdminAccountTable/>
            </div>
        </div>
    );
}
