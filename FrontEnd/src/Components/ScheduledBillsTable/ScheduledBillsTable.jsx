import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BillHistory from '../../Pages/AccountPages/BillHistory/BillHistory';
import './ScheduledBillsTable.css';
export default function ScheduledBillsTable() {

  const [data, setData] = useState([]);
  const [view, setView] = useState(false);
  const [currBill, setCurrBill] = useState(null);
  const token = localStorage.getItem('authToken');
  function onClickLink(bill) {
    setCurrBill(bill);
    setView(true);
  }

  const getScheduledBills = useCallback(async () => {
    try {
        const response = await axios.post('https://learn-to-bank-backend-7mtr.onrender.com/api/transactions/getScheduledPayments', {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        const formattedResponse = response.data.scheduledPayments.map((bills, index) => {
            const date = new Date(bills.startDate);
            const nextDate = new Date(bills.nextPaymentDate);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            const formattedNextDate = `${nextDate.getDate().toString().padStart(2, '0')}/${(nextDate.getMonth() + 1).toString().padStart(2, '0')}/${nextDate.getFullYear()}`;
            return {
                id: index + 1,  // Create an artificial id
                name: bills.name,
                amount: bills.amount,
                date: formattedDate,
                details: 'View details',
                nextPayment: formattedNextDate,
                ...bills
            };
        });
        setData(formattedResponse);
    } catch (error) {
        console.error('Error fetching scheduled bills: ', error);
    }
  }, [token]);

  useEffect(() => {
    getScheduledBills();
}, [getScheduledBills]);

function handleFrequencyDisplay(bill) {
    if(bill.type === "once") {
        return "One Time Payment";
    }
    else if(bill.type === "recurring") {
        return bill.frequency.charAt(0).toUpperCase() + bill.frequency.slice(1);
    }
}

  return (
    <div className='scheduled-bills-table'>
    {!view && (
        <>
        <table className="styled-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Next Payment</th>
                    <th>Frequency</th>
                    <th>Details</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>${row.amount}</td>
                    <td>{row.nextPayment}</td>
                    <td>{handleFrequencyDisplay(row)}</td>
                    <td>
                        <Link onClick={() => onClickLink(row)}>
                            {row.details}
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
        <BillHistory currBill = {currBill}/>
        <button className = 'scheduled-bill-history-button' onClick={() => setView(false)}>Back</button>
        </>
    )}
    </div>
  )
}
