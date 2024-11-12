import React from 'react';
import Chatbot from '../ChatBot/Chatbot.jsx';
import Navbar from '../Navbar/Navbar.jsx';

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div>{children}</div> {/* Render the children components */}
      <Chatbot />
    </div>
  );
}

