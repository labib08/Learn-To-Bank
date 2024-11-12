const express = require('express');

const { payBills, getUpcommingBills, addOrUpdateBills } = require('../controllers/billController');

const router = express.Router();

// Pay bills
router.post('/pay', payBills);

// Get upcoming bills
router.get('/upcomming/:accountNumber', getUpcommingBills);

// Add or update bills
router.post('/add-post', addOrUpdateBills);

module.exports = router;