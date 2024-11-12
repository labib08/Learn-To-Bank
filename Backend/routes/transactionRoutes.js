const express = require('express');
const { transferMoney, transferByPayId, transferWithinUser, schedulePayment, getScheduledPayments } = require('../controllers/transactionController');
const { authenticateToken } = require('../middleWare/auth')

const router = express.Router();

// Transfer money
router.post('/transfer', authenticateToken, transferMoney);

// Transfer money PayId
router.post('/payIdTransfer', authenticateToken, transferByPayId);

// Internal transfer
router.post('/transfer/within', authenticateToken, transferWithinUser);

// Schedule a payment
router.post('/schedulePayment', authenticateToken, schedulePayment);

// Get scheduled payments
router.post('/getScheduledPayments', authenticateToken, getScheduledPayments);

module.exports = router;
