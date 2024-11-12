import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminAccountTable.css';

export default function AdminAccountTable() {
    const [view, setView] = useState(false);
    const [currUser, setCurrUser] = useState(-1);
    const [searchTerm, setSearchTerm] = useState('');
    const [fundAmount, setFundAmount] = useState('');
    const [data, setData] = useState([]);
    const token = localStorage.getItem('authToken');

    const getDatabase = useCallback(async () => {
        try {
            const response = await axios.post('https://learn-to-bank-backend-7mtr.onrender.com/api/admin/getDatabase', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            const formattedResponse = response.data.map((user, index) => ({
                id: index + 1,  // Create an artificial id
                name: user.name || 'placeholder',  // Fallback in case of missing data
                username: user.username || 'placeholder username',
                email: user.email || 'placeholder email',
                transBalance: user.transactionBalance,
                accNo: user.accNo,
                isActive: user.isDeleted ? 'Account Soft Deleted' : 'Active',
                edit: 'Edit'  // Static 'Edit' string for all rows
            }));

            setData(formattedResponse);  // Replace hardcoded data with the response data

        } catch (error) {
            console.error('Error fetching users: ', error);
        }
    }, [token]);

    useEffect(() => {
        getDatabase();
    }, [getDatabase]);

    const applyBalanceChange = async() => {
        try {
            await axios.post('https://learn-to-bank-backend-7mtr.onrender.com/api/admin/setBalance', {
                accNumber: currUser.accNo,  // Use the current user's accNo in the request
                newBalance: fundAmount
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            getDatabase();
            setView(false);
        } catch (error) {
            console.error('Error applying balance change', error);
        }
    };

    const applyAccountDeactivation = async() => {
        try {
            await axios.post('https://learn-to-bank-backend-7mtr.onrender.com/api/admin/delete', {
                username: currUser.username
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            getDatabase();
            setView(false);
        } catch (error) {
            console.error('Error applying balance change', error);
        }
    }

    const applyAccountReactivation = async() => {
        try {
            await axios.post('https://learn-to-bank-backend-7mtr.onrender.com/api/admin/reactivate', {
                username: currUser.username
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            getDatabase();
            setView(false);
        } catch (error) {
            console.error('Error applying balance change', error);
        }
    }

    function onClickLink(user) {
        setCurrUser(user);
        setView(true);
    }

    function handleSearch(event) {
        setSearchTerm(event.target.value);
    }

    const handleFundAmountChange = (event) => {
        let value = event.target.value;
        if (value.includes('.')) {
            const parts = value.split('.');
            if (parts[1].length > 2) {
                value = `${parts[0]}.${parts[1].slice(0, 2)}`;
            }
        }
        setFundAmount(value);
    };

    const handleBlur = () => {
        if (fundAmount) {
            setFundAmount(parseFloat(fundAmount).toFixed(2));
        }
    };

    const filteredData = data.filter(row =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className='admin-info-table'>
            {!view && (
                <>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-bar"
                    />
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Transaction Balance</th>
                                <th>Status</th>
                                <th>Edit Account</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.name}</td>
                                    <td>{row.username}</td>
                                    <td>{row.email}</td>
                                    <td>{row.transBalance}</td>
                                    <td>{row.isActive}</td>
                                    <td>
                                        <Link onClick={() => onClickLink(row)}>
                                            {row.edit}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            {view && (
                <>
                    <div className="edit-page">
                        <div className="edit-funds">
                            <input
                                type="number"
                                placeholder="Input fund changes"
                                className="fund-amount"
                                value={fundAmount}
                                onChange={handleFundAmountChange}
                                onBlur={handleBlur}
                                min="0"
                            />
                            <button className="edit-confirm" onClick={applyBalanceChange}>Confirm</button>
                        </div>
                        <div className="purge-account">
                            <button className="purge-account" onClick={applyAccountDeactivation}>
                                {data.find(user => user.accNo === currUser.accNo)?.isActive !== 'Active' ? 'Delete Account' : 'Deactivate Account'}
                            </button>
                            {data.find(user => user.accNo === currUser.accNo)?.isActive !== 'Active' && (
                                <button className="purge-account" onClick={applyAccountReactivation}>Reactivate Account</button>
                            )}
                        </div>
                        <button className='edit-return-button' onClick={() => setView(false)}>Back</button>
                    </div>
                </>
            )}
        </div>
    );
}
