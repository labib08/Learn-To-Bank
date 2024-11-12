// controllers/adminController.js

const { User } = require('../models/models');

// Delete an account
exports.deleteAccount = async (req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ 'login.username': username });

        if (!user) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // If its not soft deleted, set soft delete to true
        if (!user.isDeleted){
            user.isDeleted = true;
            await user.save();
            res.status(200).json({ message: `Account with user ${username} soft deleted successfully` });
        }
        // Otherwise actually delete user from database
        else {
            await user.deleteOne();
            res.status(200).json({ message: `Account with user ${username} deleted successfully` });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reactivate a soft deleted account
exports.reactivateAccount = async (req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ 'login.username': username });

        if (!user) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // If user is softdeleted, reactivate it
        if (user.isDeleted){
            user.isDeleted = false;
            await user.save();
            res.status(200).json({ message: `Account with user ${username} reactivated successfully` });
        }
        // Otherwise actually delete user from database
        else {
            return res.status(404).json({ message: 'Account is already active' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Modify transactions
exports.modifyTransactions = async (req, res) => {
    const { accountNumber, transactionId, amount, description } = req.body;

    try {
        const user = await User.findOne({ AccNoBsb: accountNumber });

        if (!user) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const transaction = user.transactions.id(transactionId);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        transaction.amount = amount || transaction.amount;
        transaction.description = description || transaction.description;

        await user.save();

        res.status(200).json({ message: 'Transaction modified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.setUserBalance = async (req, res) => {
    const { accNumber, newBalance } = req.body;

    try{
        const receiver = await User.findOne({ 'AccNoBsb.accNo': accNumber });

        if (!receiver) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Set Balance
        amount = newBalance - receiver.transactionAcc.balance;
        receiver.transactionAcc.balance = newBalance;

        // Record transfer
        const transactionDate = new Date();
        receiver.transactionAcc.transactions.push({ 
            amount, 
            description: `Transfer from Administrator` ,
            date: transactionDate
        });

        await receiver.save();
        res.status(200).json({ message: `Succesfully set user ${receiver.login.username} balance to ${newBalance}` });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUsers = async (req, res) => {

    try {
        const users = await User.find({ _id: { $ne: req.userId } })
        .select('name login.username email AccNoBsb.accNo AccNoBsb.bsb transactionAcc.balance savingsAcc.balance isDeleted');

        // Map through the users and assign an artificial id based on order
        const formattedUsers = users.map((user, index) => ({
            id: index + 1,  // Artificial id based on the order in the result
            name: user.name,
            username: user.login.username,
            email: user.email,
            accNo: user.AccNoBsb.accNo,
            bsb: user.AccNoBsb.bsb,
            transactionBalance: user.transactionAcc.balance,
            savingsBalance: user.savingsAcc?.balance,  // Handle case if savingsAcc might not exist
            isDeleted: user.isDeleted
        }));

        // Send the formatted user data as a response
        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
