const express = require('express');
const { deleteAccount, setUserBalance, getUsers, reactivateAccount } = require('../controllers/adminController');
const { authenticateToken } = require('../middleWare/auth')

const router = express.Router();

// Delete an account
router.post('/delete', deleteAccount);

// Delete an account
router.post('/reactivate', reactivateAccount);

// Set Balance of a User
router.post('/setBalance', setUserBalance);

// Get Database of all users
router.post('/getDatabase', authenticateToken, getUsers);

module.exports = router;