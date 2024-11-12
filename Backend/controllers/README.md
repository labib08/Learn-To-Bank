# FinTech-FLAMES API Documentation

## Key Algorithms

### 1. Scheduling Payments Algorithm

The Scheduling Payments Algorithm manages the creation and execution of user-defined payment schedules, accommodating both one-time and recurring payments. Below are the key features and functionality:

#### Input Parameters
- **Payment Details**: 
  - Amount to be paid
  - Recipient details (Account Number, BSB, or Phone Number)
  - Payment frequency (weekly, monthly, yearly)
  - Start date of the payment schedule

#### Validation Steps
- **Recipient Verification**: 
  - Checks if the recipient exists in the database using the provided account number, BSB, or phone number.
  
- **Payment Type Handling**: 
  - Adjusts settings based on the payment type (one-time vs. recurring):
    - For one-time payments, sets frequency to `null` and total runs to `1`.

#### Data Structuring
- Scheduled payment details are structured into a schema, which includes:
  - Amount, recipient information, type of payment, schedule options, and descriptions.

#### Database Interaction
- Scheduled payments are saved in the user’s account under the `scheduledPayments` array, tracking:
  - Number of completed payments and next payment date.

#### Execution Mechanism
- A background task `node-cron` checks the current date against the `nextPaymentDate`. When a match is found, the payment is processed, and the user’s account balances are updated.

### 2. Payment Processing Algorithm

This algorithm handles the execution of payments:
- **Step 1**: Check if the user’s account has sufficient funds.
- **Step 2**: Deduct the scheduled amount from the payer's account and credit it to the recipient’s account.
- **Step 3**: Record the transaction details, including timestamps and descriptions.

## Data Import Mechanism from Third-Party Systems

Integrating data from third-party systems is essential for the functionality of the FinTech-FLAMES application. Below is an overview of the data import mechanism:

### Overview
- The application utilizes RESTful APIs to retrieve user data, transaction records, or other external financial information.

### Data Import Steps

1. **API Integration**:
   - Utilizes RESTful APIs to fetch data. Each third-party service provides an endpoint for data requests.

2. **Authentication**:
   - Manages authentication via middleware to secure access to third-party services.

3. **Data Retrieval**:
   - Sends HTTP GET requests to specific endpoints to retrieve data, e.g., user transaction history.

4. **Data Mapping and Transformation**:
   - Transforms incoming data into the expected internal schema, ensuring validation and type conversions.

5. **Database Insertion**:
   - Inserts transformed data into the MongoDB database, creating or updating user accounts and logging transactions.

6. **Scheduled Payments**:
   - Automates periodic data fetching using `node-cron` for regularly updated information and processing any scheduled payments.

7. **Logging and Error Handling**:
   - Logs all data import activities for auditing. Captures errors encountered during the import process for troubleshooting.

