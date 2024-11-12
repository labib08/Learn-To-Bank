// routes/chatbotRoutes.js
const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Route to handle chatbot messages
router.post('/chatbot', chatbotController.handleChatbotMessage);

module.exports = router;
