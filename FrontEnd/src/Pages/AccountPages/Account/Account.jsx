import React, { useState } from 'react';
import Contacts from '../Contacts/Contacts';
import Home from '../Home/Home';
import Settings from '../Settings/Settings';
import Transfer from '../Transfer/Transfer';
import ViewAccounts from '../ViewAccounts/ViewAccounts';
export default function Account({category}) {
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Jackson Williams", bsb: "953248", accountNumber: "88293680" },
    { id: 2, name: "Jackson Johnson", bsb: "460846", accountNumber: "84140165" },
    { id: 3, name: "Jackson Smith", bsb: "793160", accountNumber: "82949178" },
    { id: 4, name: "Jackson Jones", bsb: "235972", accountNumber: "88960684" },
    { id: 5, name: "Jackson Smith", bsb: "854628", accountNumber: "43667333" },
    { id: 6, name: "Jackson Williams", bsb: "555418", accountNumber: "70599594" },
    { id: 7, name: "Jackson Jones", bsb: "993620", accountNumber: "65792614"},
    { id: 8, name: "Jackson Jones", bsb: "187142", accountNumber: "85752163" },
    { id: 9, name: "Jackson Brown", bsb: "461988", accountNumber: "27744551" },
    { id: 10, name: "Jackson Williams", bsb: "324604", accountNumber: "65487411" },
  ].sort((a, b) => a.name.localeCompare(b.name)))
  const [phones, setPhones] = useState([
    { id: 1, name: "Jackson Williams", phoneNumber: "0274893621" },
    { id: 2, name: "Jackson Johnson", phoneNumber: "0412758390" },
    { id: 3, name: "Jackson Smith", phoneNumber: "0487261538" },
    { id: 4, name: "Jackson Jones", phoneNumber: "0354918276" },
    { id: 5, name: "Jackson Brown", phoneNumber: "0192837465" },
    { id: 6, name: "Jackson White", phoneNumber: "0678123456" },
    { id: 7, name: "Jackson Taylor", phoneNumber: "0743658912" },
    { id: 8, name: "Jackson Davis", phoneNumber: "0283746591" },
    { id: 9, name: "Jackson Miller", phoneNumber: "0365289174" },
    { id: 10, name: "Jackson Wilson", phoneNumber: "0456789123" }
  ].sort((a, b) => a.name.localeCompare(b.name)))

  function addContactDetailsBank (contactData) {
    const newAccount = {
      id: Date.now(),
      name: contactData.name,
      bsb: contactData.bsb,
      accountNumber: contactData.accountNumber,
    }
    setAccounts(prevAccounts => {
      const updatedAccounts = [...prevAccounts, newAccount];
      updatedAccounts.sort((a, b) => a.name.localeCompare(b.name));
      return updatedAccounts;
    });
  }

  function addContactDetailsPhone(contactData) {
    const newPhone = {
      id: Date.now(),
      name: contactData.name,
      phoneNumber: contactData.phoneNumber
    }
    setPhones(prevPhones => {
      const updatedPhones = [...prevPhones, newPhone];
      updatedPhones.sort((a, b) => a.name.localeCompare(b.name));
      return updatedPhones;
    });
  };
  function addContactDetails(contactData) {

    if (contactData.accountNumber) {
      addContactDetailsBank(contactData);
    }
    else if (contactData.phoneNumber) {
      addContactDetailsPhone(contactData);
    }
  }

  const [selectedAccount, setSelectedAccount] = useState(null)
  const [removeMessage, setRemoveMessage] = useState(false);

  function onClickRemoveAccount(account) {
    setSelectedAccount(account);
    setRemoveMessage(true);
  }

  function onClickRemoveClose() {
    setSelectedAccount(null)
    setRemoveMessage(false)
  }

  function removeAccount(selectedAccount) {

    if (selectedAccount.accountNumber) {
      setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== selectedAccount.id));
    }
    else if (selectedAccount.phoneNumber) {
      setPhones(prevAccounts => prevAccounts.filter(account => account.id !== selectedAccount.id));
    }
    setRemoveMessage(false);

  }
  const [active, setActive] = useState('Profile');
  function onClickDiv(type) {
    setActive(type);
  }
  const setCategory = (category) => {
    if (category === 'home') {
      return <Home onClickDiv={onClickDiv}/>
    }
    else if (category === 'transfer') {
      return (<Transfer
               accounts = {accounts}
               phones = {phones}
               addContactDetails = {addContactDetails}
              />)
    }
    else if (category === 'view') {
      return <ViewAccounts active={active} setActive={setActive} onClickDiv={onClickDiv}/>
    }
    else if (category === 'contacts') {
      return (<Contacts
        accounts = {accounts}
        phones = {phones}
        addContactDetails = {addContactDetails}
        selectedAccount = {selectedAccount}
        onClickRemoveAccount = {onClickRemoveAccount}
        onClickRemoveClose = {onClickRemoveClose}
        removeAccount = {removeAccount}
        removeMessage = {removeMessage}
        />)
    }
    else if (category === 'settings') {
      return <Settings/>
    }
  }
  return (
    <div>
      {setCategory(category)}
    </div>
  )
}
