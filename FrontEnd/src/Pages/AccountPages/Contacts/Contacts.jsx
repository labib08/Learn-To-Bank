import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import addSign from '../../../Assets/add-sign.svg';
import closeSign from '../../../Assets/close-button.svg';
import crossSign from '../../../Assets/cross-icon.svg';
import { Dropdown } from '../../../Components/Dropdown/Dropdown';
import './Contacts.css';
export default function Contacts({accounts, phones, addContactDetails, selectedAccount, onClickRemoveAccount, onClickRemoveClose, removeMessage}) {
  const options = ["Bank Account", "Phone"]
  const [searchAccount, setSearchAccount] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [message, setMessage] = useState('');

  const [bankContacts, setBankContacts] = useState([]);
  const [payIdContacts, setPayIdContacts] = useState([]);

  const [isAdd, setIsAdd] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [active, setActive] = useState('Bank Account');
  const [contactData, setContactData] = useState({
    contactType:"",
    name:"",
    bsb:"",
    accountNumber:"",
    phoneNumber:""
  });

  const token = localStorage.getItem('authToken');

  function handleChange (event) {
    const {name, value} = event.target;
    setIsSubmitted(false);
    setContactData(
      prevContactData => {
        return {
          ...prevContactData,
          [name]:value
        }
      }
    );
  };

  function handleSubmit(event) {
    event.preventDefault();
    addContact();
    setIsSubmitted(true);
    emptyForm();
  }

  function onClickClose () {
    setIsAdd(false);
    emptyForm();
  }

  function removeAccount(selectedAccount) {
    if (active === 'Bank Account') {
      removeBankContact(selectedAccount);
      setBankContacts((prevContacts) =>
        prevContacts.filter((account) => account.accNo !== selectedAccount.accNo)
      );
    } else if (active === 'Phone') {
      removePayIdContact(selectedAccount);
      setPayIdContacts((prevContacts) =>
        prevContacts.filter((phone) => phone.phoneNo !== selectedAccount.phoneNo)
      );
    }
    onClickRemoveClose();
  }

  function emptyForm() {
    setContactData({
      contactType: "",
      name: "",
      bsb: "",
      accountNumber: "",
      phoneNumber: ""
    })
  }

  function onClickDiv(type) {
    setActive(type);

    if (type === 'Bank Account') {
      getBankContacts();
    } else if (type === 'Phone') {
      getPayIdContacts();
    }
  }

  const filteredAccounts = bankContacts.filter(account =>
    account.name.toLowerCase().includes(searchAccount.toLowerCase())
  );

  const filteredPhones = payIdContacts.filter(phone =>
    phone.name.toLowerCase().includes(searchPhone.toLowerCase())
  );

  const getBankContacts = useCallback(async () => {
    try {
      const response = await axios.post('https://learn-to-bank-backend-7mtr.onrender.com/api/accounts/getBankContacts', {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setBankContacts(response.data);
    } catch (error) {
      console.error('Error fetching bank contacts:', error);
    }
  }, [token]); // Add token as a dependency if it's used inside the function

  const getPayIdContacts = useCallback(async () => {
    try {
      const response = await axios.post('https://learn-to-bank-backend-7mtr.onrender.com/api/accounts/getPayIdContacts', {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setPayIdContacts(response.data);
    } catch (error) {
      console.error('Error fetching PayID contacts:', error);
    }
  }, [token]);

  const addContact = async () => {
    try {
      let contactPackage;

      if (contactData.contactType === 'Bank') {
        contactPackage = {
          name: contactData.name,
          bsb: contactData.bsb,
          accNo: contactData.accountNumber
        }
      } else {
        contactPackage = {
          name: contactData.name,
          phoneNo: contactData.phoneNumber
        }
      }
      const response = await axios.post('https://learn-to-bank-backend-7mtr.onrender.com/api/accounts/addContact', contactPackage, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.success) {
        if (contactData.contactType === "Bank") {
          setBankContacts((prevContacts) => [
            ...prevContacts,
            {
              id: new Date().getTime(), // Generate a temporary unique id
              name: contactData.name,
              bsb: contactData.bsb,
              accNo: contactData.accountNumber,
            },
          ]);
        } else if (contactData.contactType === "Phone") {
          setPayIdContacts((prevContacts) => [
            ...prevContacts,
            {
              id: new Date().getTime(), // Generate a temporary unique id
              name: contactData.name,
              phoneNo: contactData.phoneNumber,
            },
          ]);
        }
        addContactDetails(contactData);
        emptyForm();
      }
      setMessage(response.data.message);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(`${error.response.data.message}`);
      } else {
        setMessage('Error Adding Contact:', error);
      }
    };
  }

  const removeBankContact = async (selectedAccount) => {
    try{
      let contactPackage = {
        bsb: selectedAccount.bsb,
        accNo: selectedAccount.accNo
      }
      await axios.post('https://learn-to-bank-backend-7mtr.onrender.com/api/accounts/removeBankContact', contactPackage, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

    } catch (error) {
      console.log(error);
    }
  };

  const removePayIdContact = async (selectedAccount) => {
    try{
      let contactPackage = {
        phoneNo: selectedAccount.phoneNo
      }
      await axios.post('https://learn-to-bank-backend-7mtr.onrender.com/api/accounts/removePayIdContact', contactPackage, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBankContacts();
    getPayIdContacts();
  }, [getBankContacts, getPayIdContacts]);

  return (
    <div className="contact">
      <div className="contact-header">
      <Dropdown active = {active} setActive = {setActive} options = {options} />
        <p className='contact-header-left'>Contact List</p>
        <div className='mobile-view'>
          ({active})
        </div>
        <div className="hover-div">
        <img
            src={addSign}
            alt=''
            onClick={() => {
            setIsAdd(true);
            setIsSubmitted(false);
            }}
          />
        </div>
      </div>
      <div className="contact-container">
        <div className="contact-sidebar">
          <div className={`sidebar-bank ${active === "Bank Account" ? "sidebar-bank-active" : ""}`} onClick={() => onClickDiv("Bank Account")}>
            <p>Bank account</p>
          </div>
          <div className={`sidebar-phone ${active === "Phone" ? "sidebar-phone-active" : ""}`} onClick={() => onClickDiv("Phone")}>
            <p>Phone</p>
          </div>
        </div>
        <div className="contact-content">
          {active === "Bank Account" && (
            <>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by Name"
                value={searchAccount}
                onChange={(e) => setSearchAccount(e.target.value)}
                className="search-input"
              />
            </div>
            <div className='contact-list-body'>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <div key={account.id} className='contact-list-individual'> {/* Ensure 'account.id' is unique */}
                    <div className='contact-information'>
                      <h3>{account.name}</h3>
                      <p>BSB: {account.bsb}</p>
                      <p>Account Number: {account.accNo}</p>
                    </div>
                    <div className='contact-remove-sign'>
                      <img src={crossSign} alt='' onClick={() => onClickRemoveAccount(account)} />
                    </div>
                  </div>
                ))
              ) : (
                <p>No Contacts!</p>
              )}
            </div>
            </>
          )}
          {active === "Phone" && (
            <>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by Name"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="search-input"
              />
            </div>
            <div className='contact-list-body'>
              {filteredPhones.length > 0 ? (
                filteredPhones.map((phone) => (
                  <div key={phone.id} className='contact-list-individual'> {/* Ensure 'phone.id' is unique */}
                    <div className='contact-information'>
                      <h3>{phone.name}</h3>
                      <p>Phone Number: {phone.phoneNo}</p>
                    </div>
                    <div className='contact-remove-sign'>
                      <img src={crossSign} alt='' onClick={() => onClickRemoveAccount(phone)} />
                    </div>
                  </div>
                ))
              ) : (
                <p>No Contacts!</p>
              )}
            </div>
            </>
          )}
          {removeMessage && (
            <>
              <div className='remove-form-overlay'>
              <div className='remove-form-content'>
              <img src={closeSign} alt='' onClick={onClickRemoveClose}/>
                <p>Are you sure you want to remove
                  <span className="highlight-name"> {selectedAccount.name} </span>
                from your contacts?</p>
                <button onClick={() => removeAccount(selectedAccount)}>Remove</button>
              </div>
              </div>
            </>
          )}
        </div>
      </div>
      {isAdd && (
        <>
          <div className='contact-form-overlay'>
          <div className='contact-form-content'>
            <div className='contact-form-header'>
              <p>Fill Contact</p>
              <img src={closeSign} alt='' onClick={onClickClose}/>
            </div>
            <form onSubmit={handleSubmit}>
            <span>
                    <label htmlFor='contact-type' className='contact-form-label'>Transfer Options</label>
                    <select
                        id='contact-type'
                        name='contactType'
                        value={contactData.contactType}
                        onChange={handleChange}
                        className='contact-form-fill-up'
                        required
                    >
                        <option value="">-- Choose Method --</option>
                        <option value="Bank">Bank</option>
                        <option value="Phone">Phone</option>
                    </select>
                </span>
                {contactData.contactType === "Bank" && (
                      <>
                      <span>
                          <p className='contact-form-label'>Name</p>
                              <input
                                  type="name"
                                  placeholder="Name"
                                  onChange={handleChange}
                                  name="name"
                                  value={contactData.name}
                                  className="contact-form-fill-up"
                                  required
                              />
                      </span>
                      <span>
                          <p className='contact-form-label'>BSB</p>
                              <input
                                  type="text"
                                  placeholder="BSB"
                                  onChange={handleChange}
                                  name="bsb"
                                  value={contactData.bsb}
                                  className="contact-form-fill-up"
                                  maxLength="6"
                                  pattern="\d{6}"
                                  title="Please enter exactly 6 digits"
                                  required
                              />
                      </span>
                      <span>
                        <p className='contact-form-label'>Account Number</p>
                          <input
                            type="text"
                            placeholder="Account Number"
                            onChange={handleChange}
                            name="accountNumber"
                            value={contactData.accountNumber}
                            className="contact-form-fill-up"
                            maxLength="8"
                            pattern="\d{8}"
                            title="Please enter exactly 8 digits"
                            required
                          />
                      </span>
                      </>
                  )}
                  {contactData.contactType === "Phone" && (
                      <>
                      <span>
                          <p className='contact-form-label'>Name</p>
                              <input
                                  type="name"
                                  placeholder="Name"
                                  onChange={handleChange}
                                  name="name"
                                  value={contactData.name}
                                  className="contact-form-fill-up"
                                  required
                              />
                      </span>
                      <span>
                        <p className='contact-form-label'>Phone Number</p>
                          <input
                            type="text"
                            placeholder="Phone Number"
                            onChange={handleChange}
                            name="phoneNumber"
                            value={contactData.phoneNumber}
                            className="contact-form-fill-up"
                            maxLength={10}
                            pattern="\d{10}"
                            title="Please enter exactly 10 digits"
                            required
                          />
                      </span>
                      </>
                  )}
                  {isSubmitted && (
                    <>
                      <p>{message}</p>
                    </>
                  )}
                <button type='submit'>Save</button>
            </form>
          </div>
        </div>
        </>
      )}
    </div>
  )
}