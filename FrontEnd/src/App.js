import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './Components/Layout/Layout.jsx';
import Account from './Pages/AccountPages/Account/Account.jsx';
import EditProfile from './Pages/AccountPages/EditProfile/EditProfile.jsx';
import ResetPassword from './Pages/AccountPages/Reset/Reset.jsx';
import ForgotPassword from './Pages/IntroPages/Forgot/Forgot.jsx';
import Homepage from './Pages/IntroPages/HomePage/Homepage.jsx';
import SignUp from './Pages/IntroPages/SignUp/SignUp.jsx';
import { InstructionsProvider } from './InstructionsContext.js';
import OneTimePin from './Pages/IntroPages/Forgot/OneTimePin.jsx';
import AdminPanel from './Pages/AccountPages/AdminPanel/AdminPanel.jsx';

function App() {
  return (
    <InstructionsProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path = "/" element = {<Homepage />} />
            <Route path = "/signup" element = {<SignUp />} />
            <Route path = "/home" element = {<Layout> <Account category="home" /> </Layout>} />
            <Route path = "/view" element = {<Layout> <Account category="view" /> </Layout>} />
            <Route path = "/contacts" element = {<Layout> <Account category="contacts" /> </Layout>} />
            <Route path = "/transfer" element = {<Layout> <Account category="transfer" /> </Layout>} />
            <Route path = "/settings" element = {<Layout> <Account category="settings" /> </Layout>} />
            <Route path = "/forgot-password" element = {<ForgotPassword />} />
            <Route path = "/resetpassword" element = {<ResetPassword />} />
            <Route path = '/otp' element = {<OneTimePin/>}/>
            <Route path = "/editprofile" element = {<Layout> <EditProfile /> </Layout>} />
            <Route path = '/adminpanel' element = {<Layout> <AdminPanel/> </Layout>} />
          </Routes>
        </BrowserRouter>
      </div>
    </InstructionsProvider>
  );
}

export default App;
