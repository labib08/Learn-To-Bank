// controllers/accountController.js
const { User, generateRandomCardNumber, generateRandomCVV, generateAccNo, generateBsb, generatePhoneNo } = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Account Registration / Creation
exports.createAccount = async (req, res) => {
    const { name, email, username, password} = req.body;
    try {
        // Check if username is already taken
        const existingUser = await User.findOne({ 'login.username': username });
        // Check if email is already in use
        const existingEmail = await User.findOne({ email });

        if(existingUser && existingEmail) {
            return res.status(400).json({ message: 'Username and email are already registered to an account' });
        }
        else if (existingUser) {
            return res.status(400).json({ message: 'Username has been taken' });
        }
        else if (existingEmail) {
            return res.status(400).json({ message: 'This email already has an registered account, please login instead' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate random unique Account Number and BSB
        const accNo = await generateAccNo();
        const bsb = await generateBsb();

        // Card Details
        const cardNumber = generateRandomCardNumber();
        const cvv = generateRandomCVV();
        const expiryMonth = new Date().getMonth() + 1;
        const expiryYear = new Date().getFullYear() + 5;

        // Deposit
        const initialDeposit = 30000;

        // Phone Number
        const phoneNo = await generatePhoneNo();

        // Create new user
        const newUser = new User({
            name,
            phoneNo,
            email,
            login: {
                username,
                password: hashedPassword
            },
            AccNoBsb: {
                accNo,
                bsb
            },
            transactionAcc: {
                balance: initialDeposit
            },
            savingsAcc: {
                balance: 0
            },
            cardDetails: {
                number: cardNumber,
                cvv,
                expiryMonth,
                expiryYear
            },
            roles: 'user',
            lastLogedInAt: new Date(),
            is2FAEnabled: true,
            isDeleted: false,
            // scheduledPayments: []
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'Server error - Create Account' });
    }
};

// Account Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by login schema username
        const user = await User.findOne({ 'login.username': username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Username' });
        }
         // Check if user is deleted (soft delete)
        else if (user.isDeleted) {
            return res.status(403).json({ message: 'User account is inactive or deleted.' });
        }


        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.login.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user._id, name: user.name });
    } catch (error) {
        //console.error("Login server error: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Account Details
exports.getUserAccount = async (req, res) => {
    try{
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract the relevant account information
        const accountData = {
            name: user.name,
            username: user.login.username,
            phoneNo: user.phoneNo,
            email: user.email,
            bsb: user.AccNoBsb.bsb,
            accNo: user.AccNoBsb.accNo,
            transAccDetails: {
                balance: user.transactionAcc.balance,
                transactions: user.transactionAcc.transactions
            },
            savingAccDetails: {
                balance: user.savingsAcc.balance,
                transactions: user.savingsAcc.transactions
            },
            cardDetails: user.cardDetails,
            role: user.roles
        };
        res.json(accountData);
    } catch(error) {
        // console.error("Error fetching user account details:", error);
        res.status(500).json({ message: 'Server error' });
    }


};

// update user email
exports.updateUserProfile = async (req, res) => {
    let { username, email } = req.body;
    email = String(email);

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.email = email;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// forgot password
exports.forgotPassword = async (req, res) => {
    let { email, token } = req.body;
    email = String(email);

    try {
        // Find the user by username
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        token = generateToken(email);
        sendtoken(email, token);

        res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
    let { username, password } = req.body;
    const { token } = req.params;

   try {
       // Find the user by the reset token and check if the token has expired
       const user = await User.findOne({
           resetPasswordToken: token,
           resetPasswordExpires: { $gt: Date.now() }, // Ensure the token is not expired
           });

       if (!user) {
       return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
       }

       // Hash the new password
       const hashedPassword = await bcrypt.hash(password, 10);

       // Update the user's password and clear the reset token and expiration time
       user.login[0].password = hashedPassword; // Assuming only one login entry per user
       user.resetPasswordToken = undefined;
       user.resetPasswordExpires = undefined;

       await user.save();
       res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addContact = async (req, res) => {
    let { name, bsb, accNo, phoneNo } = req.body;

    bsb = bsb ? Number(bsb) : undefined;
    accNo = accNo ? Number(accNo) : undefined;
    phoneNo = phoneNo ? Number(phoneNo) : undefined;

    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (bsb && accNo) {
            const existingBankContact = user.bankContacts.find(contact => contact.bsb === bsb && contact.accNo === accNo);
            if (existingBankContact) {
                return res.status(404).json({ message: 'A contact with these bank details already exists' });
            }

            const contact = await User.findOne({ 'AccNoBsb.accNo': accNo,  'AccNoBsb.bsb': bsb});
            if (!contact) {
                return res.status(404).json({ message: 'A User with these details does not exist' });
            }
            user.bankContacts.push({ name, bsb, accNo });
        } else if (phoneNo) {
            const existingPayIdContact = user.payIdContacts.find(contact => contact.phoneNo === phoneNo);
            if (existingPayIdContact) {
                return res.status(404).json({ message: 'A contact with this phone number already exists' });
            }

            const contact = await User.findOne({ 'phoneNo': phoneNo });
            if (!contact) {
                return res.status(404).json({ message: 'A User with this phone number does not exist' });
            }
            user.payIdContacts.push({ name, phoneNo });
        } else {
            return res.status(400).json({ message: 'Invalid contact details provided' });
        }

        await user.save();
        res.status(200).json({ message: 'Contact Added Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBankContacts = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.bankContacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPayIdContacts = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.payIdContacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeBankContact = async (req, res) => {
    let { bsb, accNo } = req.body;

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the contact exists before attempting to remove it
        const contactExists = user.bankContacts.some(contact => contact.bsb === Number(bsb) && contact.accNo === Number(accNo));
        if (!contactExists) {
            return res.status(404).json({ message: 'Contact you want to remove does not exist' });
        }

        // Pull the contact with the matching bsb and accNo from the bankContacts array
        await User.findByIdAndUpdate(
            req.userId,
            {
                $pull: {
                    bankContacts: { bsb: Number(bsb), accNo: Number(accNo) }
                }
            },
            { new: true }
        );

        res.status(200).json({ message: 'Bank contact removed successfully' });
    } catch (error) {
        console.error('Server error during remove bank contact operation:', error.message);
        res.status(500).json({ message: 'Server error - remove bank contact' });
    }
};

exports.removePayIdContact = async (req, res) => {
    let { phoneNo } = req.body;

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the PayID contact exists before attempting to remove it
        const contactExists = user.payIdContacts.some(contact => contact.phoneNo === Number(phoneNo));
        if (!contactExists) {
            return res.status(404).json({ message: 'Contact you want to remove does not exist' });
        }

        // Pull the contact with the matching phoneNo from the payIdContacts array
        await User.findByIdAndUpdate(
            req.userId,
            {
                $pull: {
                    payIdContacts: { phoneNo: Number(phoneNo) }
                }
            },
            { new: true }
        );

        res.status(200).json({ message: 'PayId contact removed successfully' });
    } catch (error) {
        console.error('Server error during remove PayID contact operation:', error.message);
        res.status(500).json({ message: 'Server error - remove PayID contact' });
    }
};
