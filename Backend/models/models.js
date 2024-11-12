const mongoose = require('mongoose');
const speakeasy = require('speakeasy');
const rateLimit = require('express-rate-limit');
const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const crypto = require('crypto'); // For generating secure tokens
const nodemailer = require('nodemailer'); // For sending emails
const cron = require('node-cron'); // for updating every fixed period

// set up express.json() middleware to parse JSON bodies
app.use(express.json());

// Define the Transaction schema
const transactionSchema = new mongoose.Schema({
  amount: Number,
  date: { type: Date, default: Date.now },
  log: String,
  description: String
});

// Define the Login schema
const loginDetailSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true }
});


// Define the Acc No and Bsb schema
const AccnoBsbSchema = new mongoose.Schema({
  accNo: {type: Number, unique: true},
  bsb: {type: Number, unique: true}
});

// Define the card details schema
const cardDetailSchema = new mongoose.Schema({
  number: {type: String, required: true, unique: true},
  cvv: {type: String, required: true},
  expiryMonth: {type: Number,required: true, default: new Date().getMonth() + 1},
  expiryYear: {type: Number,required: true, default: (((new Date().getFullYear())%100) + 5)}
});

// Define account schema
const accountDetailSchema = new mongoose.Schema({
  balance: {type: Number, required: true},
  transactions: [transactionSchema] // Embedding transactions inside the account instance
})

// Define Scheduled payments
const scheduledPaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  nextPaymentDate: { type: Date, required: true },
  type: { type: String, enum: ['once', 'recurring']},
  frequency: { type: String, enum: ['weekly', 'monthly', 'yearly']},
  repeatCount: { type: Number, required: true }, // Number of times the payment should be made
  completedCount: { type: Number, default: 0 }, // Track how many payments have been made
  lastPaymentDate: { type: Date }, // Track when the last payment was made
  targetAccNo: {
    accNo: { type: Number },
    bsb: { type: Number }
  },
  targetPhoneNo: { type: Number },
  description: String,
});

// Define bank contacts schema
const bankContactSchema = new mongoose.Schema({
  name: {type: String, required: true},
  bsb: {type: Number, required: true},
  accNo: {type: Number, required: true}
});

// Define payid contacts schema
const payIdContactSchema = new mongoose.Schema({
  name: {type: String, required: true},
  phoneNo: {type: Number, required: true}
});

// Define a schema for User
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNo: {type: Number, required: true, unique: true},
  email: { type: String, required: true, unique: true },
  login: loginDetailSchema, // Embedding login inside the user
  AccNoBsb: AccnoBsbSchema, // Embedding accnobsb inside the user
  transactionAcc: accountDetailSchema, // Embedding transaction account object inside the user
  savingsAcc: accountDetailSchema, // Embedding savings account object inside the user
  lastLogedInAt: {type: Date, default: Date.now },
  scheduledPayments: [scheduledPaymentSchema], // Embedding scheduled payments
  cardDetails: cardDetailSchema, // Embedding card inside the user
  roles: {type: String, required: true, default: "user"},
  transactions: [transactionSchema],
  bankContacts: [bankContactSchema],
  payIdContacts: [payIdContactSchema],
  is2FAEnabled: {type: Boolean, default: false},
  isDeleted: { type: Boolean, default: false }
});



// Create a model from the schema
const User = mongoose.model('User', UserSchema);

module.exports = {
  User,
  generateRandomCardNumber,
  generateRandomCVV,
  generateAccNo,
  generateBsb,
  generatePhoneNo
};

//const randomCardNumber = generateRandomCardNumber();
//const randomCVV = generateRandomCVV(); // 3-digit CVV
async function generatePhoneNo() {
  do{
    areaCode = Math.floor(Math.random() * 800) + 200;
    exchangeCode = Math.floor(Math.random() * 900) + 100;
    lineNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    phoneNumber = parseInt(`${areaCode}${exchangeCode}${lineNumber}`, 10);

    existingUser = await User.findOne({phoneNumber})
  } while(existingUser)


  // Combine the parts into a phone number format (XXX-XXX-XXXX)
  return phoneNumber;
}

async function generateAccNo() {
  let accNo;
  let existingUser;

  // Keep generating until a unique one is found
  do {
    accNo = Math.floor(10000000 + Math.random() * 90000000); // Generates a random 8-digit number
    existingUser = await User.findOne({ 'AccNoBsb.accNo': accNo});
  } while (existingUser);

  return accNo;
};

async function generateBsb() {
  let bsb;
  let existingUser;

  // Keep generating until a unique one is found
  do {
    bsb = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
    existingUser = await User.findOne({ 'AccNoBsb.bsb': bsb });
  } while (existingUser);

  return bsb;
};

//generating token for password reset
async function generateToken(username) {
  const user = await User.findOne({ username });
  if (!user) {
    console.log('User not found');
    return;
  }
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();
  return resetToken;
}

// send the token for reset password
async function sendToken(username, token) {
  const user = await User.findOne({ username });
  if (!user) {
    console.log('User not found');
    return;
  }
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Email service, e.g., 'Gmail', 'Outlook', etc.
    auth: {
    user: 'fintechofficialreset@gmail.com', // Your email address
    pass: 'Official@2024', // Your email password or app-specific password
      },
  });

  const mailOptions = {
    to: user.email,
    subject: 'Password Reset Request',
    text: `Your OTP is ${token}, Follow this link to reset your password: http://localhost/reset/${token}`,
  };

  await transporter.sendMail(mailOptions);
}



async function updateLastLoggedIn(email) {
    const user = await User.findOne({email});
    if (!user) {
        console.log('User not found');
        return;
    }

    user.lastLoggedInAt = new Date(); // Set lastLoggedIn to now
    await user.save();

    console.log('User Last Logged In Updated:', user.lastLoggedInAt);
}



async function checkIfLoggedInLastTwoMonths(email) {
  const user = await User.findOne({email});
  if (!user) {
    console.log('User not found');
    return;
  }

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  if (user.lastLoggedInAt && user.lastLoggedInAt >= twoMonthsAgo) {
    console.log('User has logged in within the last two months.');
  } else {
    console.log('User has not logged in within the last two months.');
  }
}



// Function to change the role of a user from "user" to "admin"
async function changeUserRoleToAdmin(email) {
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      console.log('User not found');
      return;
    }

    // Check if the user is already an admin
    if (user.roles === 'admin') {
      console.log('User is already an admin.');
      return;
    }

    // Update the user's role to "admin"
    user.roles = 'admin';
    await user.save();

    console.log(`User role updated to admin for: ${user.email}`);
  } catch (error) {
    console.error('Error updating user role:', error);
  }
}



// Soft delete function
async function softDeleteUser(email) {
  const user = await User.findOne({ email });
  if (user) {
    user.isDeleted = true;
    await user.save();
  }
}



// Function to generate a random 16-digit card number
function generateRandomCardNumber() {
  let cardNumber = '';

  for (let i = 0; i < 16; i++) {
    cardNumber += Math.floor(Math.random() * 10); // Generate a random digit (0-9)
  }

  return cardNumber;
}



// Function to generate a random CVV number (3 or 4 digits)
function generateRandomCVV(length = 3) {
  let cvv = '';

  for (let i = 0; i < length; i++) {
    cvv += Math.floor(Math.random() * 10); // Generate a random digit (0-9)
  }

  return cvv;
}



// Generate a secret for 2FA
function generate2FA() {
  const secret = speakeasy.generateSecret({ length: 20 });
  return secret;
}



// Verify a 2FA token
function verify2FA(token, secret) {
  return speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: token,
  });
}



// setting max login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts. Please try again later.',
});



// Route for login
app.post('/login', loginLimiter, async (req, res) => {
  const { username, password, token } = req.body; // Assuming the client sends a token for 2FA

  try {
    // Step 1: Find the user by username
    const user = await User.findOne({ 'login.username': username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 2: Check if the user is already deleted (if implementing soft delete)
    if (user.isDeleted) {
      return res.status(403).json({ message: 'User account is inactive or deleted.' });
    }

    // Step 3: Get the user's login details
    const loginDetails = user.login.find((login) => login.username === username);

    // Step 4: Verify the password
    const passwordMatches = await bcrypt.compare(password, loginDetails.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Step 5: If 2FA is enabled, verify the 2FA token
    const is2FAEnabled = user.is2FAEnabled; // Assume this field indicates if 2FA is enabled

    if (is2FAEnabled) {
      const secret = user.twoFASecret; // Assume you have stored the 2FA secret for the user
      const isTokenValid = verify2FA(token, secret); // Function to verify 2FA

      if (!isTokenValid) {
        return res.status(401).json({ message: 'Invalid 2FA token' });
      }
    }

    // Step 6: Check user roles and conditions (Optional)
    if (user.roles !== 'user' && user.roles !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Step 7: Update the last logged-in timestamp
    user.lastLoggedInAt = new Date();
    await user.save();

    // Step 8: Generate an authentication token (JWT, Session ID, etc.)
    // Assume you use JWT for session management (install jsonwebtoken library)
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id, role: user.roles }, 'your_jwt_secret', { expiresIn: '1h' });

    // Step 9: Respond to the client with a success message and the JWT token
    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// function for admin to be able to search for users
async function searchUsers(query) {
  const users = await User.find({ name: new RegExp(query, 'i') });
  return users;
}



// Fetch the user profile
app.get('/user/profile', async (req, res) => {
  try {
    // Assume the user is authenticated, and you have their user ID or email from the session or token
    const email = req.user.email; // Replace with your method of retrieving the user's identifier

    // Find the user by email
    const user = await User.findOne({ email }, '-login -cardDetails'); // Exclude sensitive information

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Update the user profile
app.put('/user/profile', async (req, res) => {
  try {
    const email = req.user.email; // Replace with your method of retrieving the user's identifier
    const { name, phoneNo, email: newEmail } = req.body; // Destructure the fields that can be updated

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the fields only if they are provided
    if (name) user.name = name;
    if (phoneNo) user.phoneNo = phoneNo;
    if (newEmail) user.email = newEmail;

    // Save the updated user profile
    await user.save();

    res.json({ message: 'User profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Function to handle forgot password request
async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a secure token
    const token = crypto.randomBytes(20).toString('hex');

    // Set token and expiration time (e.g., 1 hour from now)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    // Save the user's reset token and expiration time
    await user.save();

    // Send the password reset email
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested to reset the password for your account.
      Please click on the following link, or paste it into your browser to complete the process within one hour of receiving this email:
      http://${req.headers.host}/reset/${token}
      If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'An email has been sent with further instructions.' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



// Function to handle password reset
async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

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

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Error in resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


// Utility function to add time based on frequency
const addFrequency = (date, frequency) => {
    const newDate = new Date(date);
    if (frequency === 'weekly') {
        newDate.setDate(newDate.getDate() + 7);
    } else if (frequency === 'monthly') {
        newDate.setMonth(newDate.getMonth() + 1);
    }
    return newDate;
};

// Utility function to determine if 2 dates are the same or not
function areDatesSameDay(date1, date2) {
  return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
  );
}

function handleNextPaymentDate(bill) {
  if (bill.type === 'once') { 
    return bill.nextPaymentDate;
  }
  else if (bill.type === 'recurring') {
    let newNextPaymentDate = new Date(bill.nextPaymentDate);
    if (bill.frequency === 'weekly') {
      newNextPaymentDate.setDate(bill.nextPaymentDate.getDate() + (7 * (bill.completedCount)));
    }
    else if (bill.frequency === 'monthly') {
      newNextPaymentDate.setMonth(bill.nextPaymentDate.getMonth() + (bill.completedCount));
    }
    else if (bill.frequency === 'yearly') {
      newNextPaymentDate.setFullYear(bill.nextPaymentDate.getFullYear() + (bill.completedCount));
    }
    return newNextPaymentDate;
  }
}

// Schedule the cron job to run every minute
cron.schedule('*/1 * * * *', async () => {
  

    try {
        const currentTime = new Date();
        console.log(`Checking for scheduled payments... | ${currentTime}`);
        // Find all users with active scheduled payments due
        const users = await User.find({
          scheduledPayments: { $exists: true, $not: { $size: 0 } }
        });
        for (const user of users) {
          for (let i = user.scheduledPayments.length - 1; i >= 0; i--) {
            const payment = user.scheduledPayments[i];
            const nextPaymentDate = new Date(payment.nextPaymentDate);

            if (!areDatesSameDay(nextPaymentDate, currentTime)) {
                continue;
            }

            // Determine the receiver
            let receiver;
            if (payment.targetAccNo.accNo && payment.targetAccNo.bsb) {
                receiver = await User.findOne({ 'AccNoBsb.accNo': payment.targetAccNo.accNo, 'AccNoBsb.bsb': payment.targetAccNo.bsb });
            } else if (payment.targetPhoneNo) {
                receiver = await User.findOne({ 'phoneNo': payment.targetPhoneNo });
            }

            // Perform the transfer
            user.transactionAcc.balance -= payment.amount;
            receiver.transactionAcc.balance += payment.amount;
            payment.completedCount += 1;
            payment.nextPaymentDate = handleNextPaymentDate(payment);

            // Record the transaction for the user
            user.transactionAcc.transactions.push({
                amount: -payment.amount,
                date: currentTime,
                log: `Scheduled payment sent to ${receiver.name}`,
                description: payment.description
            });

            // Record the transaction for the receiver
            receiver.transactionAcc.transactions.push({
                amount: payment.amount,
                date: currentTime,
                log: `Scheduled payment received from ${user.name}`,
                description: payment.description
            });

            // Check if the payment should be deleted (e.g., after reaching the repeatCount or other termination condition)
            if (payment.completedCount === payment.repeatCount || payment.type === 'once') {
                user.scheduledPayments.splice(i, 1); // Remove the payment from the array
            }
            // Save the changes for both the user and the receiver
            await user.save();
            await receiver.save();
          }
        }
    } catch (error) {
        console.error('Error processing scheduled payments:', error.message);
    }
});

module.exports = {
  User,
  generateAccNo,
  generateBsb,
  generateRandomCardNumber,
  generateRandomCVV,
  generatePhoneNo,
};
