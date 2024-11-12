# FinTech-Flames

## Database Structure

This section provides a detailed description of the database structure used in the FinTech-Flames application, outlining the various schemas and their relationships.

### Overview of Schemas

The application uses MongoDB with Mongoose to define the following schemas:

1. **User Schema**
   - **Purpose**: Represents a user in the system, containing personal details, account information, and related transactions.
   - **Fields**:
     - `name`: String (required)
     - `phoneNo`: Number (required, unique)
     - `email`: String (required, unique)
     - `login`: Embedded `LoginDetail` schema
     - `AccNoBsb`: Embedded `AccnoBsb` schema
     - `transactionAcc`: Embedded `AccountDetail` schema for transaction accounts
     - `savingsAcc`: Embedded `AccountDetail` schema for savings accounts
     - `lastLoggedInAt`: Date (default: now)
     - `scheduledPayments`: Array of embedded `ScheduledPayment` schemas
     - `cardDetails`: Embedded `CardDetail` schema
     - `roles`: String (default: "user")
     - `transactions`: Array of embedded `Transaction` schemas
     - `bankContacts`: Array of embedded `BankContact` schemas
     - `payIdContacts`: Array of embedded `PayIdContact` schemas
     - `is2FAEnabled`: Boolean (default: false)
     - `isDeleted`: Boolean (default: false)

2. **Account Detail Schema**
   - **Purpose**: Manages account balance and embeds transactions.
   - **Fields**:
     - `balance`: Number (required)
     - `transactions`: Array of embedded `Transaction` schemas

3. **Transaction Schema**
   - **Purpose**: Represents individual transactions.
   - **Fields**:
     - `amount`: Number
     - `date`: Date (default: now)
     - `log`: String
     - `description`: String

4. **Scheduled Payment Schema**
   - **Purpose**: Handles recurring payments.
   - **Fields**:
     - `amount`: Number (required)
     - `name`: String (required)
     - `startDate`: Date (required)
     - `nextPaymentDate`: Date (required)
     - `type`: String (enum: ['once', 'recurring'])
     - `frequency`: String (enum: ['weekly', 'monthly', 'yearly'])
     - `repeatCount`: Number (required)
     - `completedCount`: Number (default: 0)
     - `lastPaymentDate`: Date
     - `targetAccNo`: Embedded `AccnoBsb` schema
     - `targetPhoneNo`: Number
     - `description`: String

5. **Login Detail Schema**
   - **Purpose**: Stores user login information.
   - **Fields**:
     - `username`: String (required, unique)
     - `password`: String (required)

6. **Card Detail Schema**
   - **Purpose**: Stores details of a user's card.
   - **Fields**:
     - `number`: String (required, unique)
     - `cvv`: String (required)
     - `expiryMonth`: Number (required, default: current month + 1)
     - `expiryYear`: Number (required, default: current year + 5)

7. **Bank Contact Schema**
   - **Purpose**: Stores details of the user's bank contacts.
   - **Fields**:
     - `name`: String (required)
     - `bsb`: Number (required)
     - `accNo`: Number (required)

8. **PayID Contact Schema**
   - **Purpose**: Stores details of the user's PayID contacts.
   - **Fields**:
     - `name`: String (required)
     - `phoneNo`: Number (required)

9. **AccnoBsb Schema**
   - **Purpose**: Stores account number and BSB details.
   - **Fields**:
     - `accNo`: Number (unique)
     - `bsb`: Number (unique)
