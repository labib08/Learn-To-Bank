import React from 'react'

export default function BillHistory({currBill}) {
  return (
    <div>
        <p className='bill-history-header'>BillHistory, show: {currBill.id}</p>
        <p className='bill-history-details'>Name: {currBill.name}</p>
        <p className='bill-history-details'>BSB: {currBill.targetAccNo ? currBill.targetAccNo.bsb : 'N/A'}</p>
        <p className='bill-history-details'>Account Number: {currBill.targetAccNo ? currBill.targetAccNo.accNo : 'N/A'}</p>
        <p className='bill-history-details'>Phone Number: {currBill.targetPhoneNo ? currBill.targetPhoneNo : 'N/A'}</p>
        <p className='bill-history-details'>Amount: ${currBill.amount}</p>
        <p className='bill-history-details'>Number of Payments remaining: {currBill.repeatCount - currBill.completedCount}</p>
        <p className='bill-history-details'>Number of Payments scheduled: {currBill.repeatCount}</p>
    </div>
  )
}
