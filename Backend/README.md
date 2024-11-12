## Backend Logic Layer
This layer contains the core logic of the application, processing user requests and interacting with the data layer.

- **Technologies Used**: Node.js, Express.js, jsonwebtoken, bcryptjs, fuse.js, fs, path

##### Key Components:
- **`AccountController.js`**
  - **Description**: Manages user-related functionalities.
  - **Responsibilities**: Contains methods for user registration, login, and account management.

- **`TransactionController.js`**
  - **Description**: Processes transaction-related logic.
  - **Responsibilities**: Handles payment processing, scheduling, and retrieving transaction history.

 - **`ChatbotController.js`**
   - **Description**: Processes chatbot-related logic.
   - **Responsibilities**: Handles user inputs and chatbot responses

- **`AdminController.js`**
  - **Description**: Manages admin-specific tasks.
  - **Responsibilities**: Handles account management and reporting functionalities.

- **`server.js`**
  - **Description**: The main entry point for the server application that initializes and configures the Express server.
  - **Responsibilities**: 
    - Sets up middleware for request handling, including JSON parsing and CORS.
    - Defines route handlers for various API endpoints, including accounts, transactions, administration, and chatbot interactions.
    - Connects to the MongoDB database and starts the server.
    - Logs incoming requests for monitoring purposes.

##### Key Algorithmns
- [Scheduled Payments](controllers/README.md)

## Data Access Layer
The data access layer is responsible for interacting with the database, handling data retrieval, storage, and management.
- **Technologies Used**:  Node.js, Express.js, Mongoose, MongoDB, bcryptjs, speakeasy, nodemailer, express-rate-limit, node-cron

##### Key Components:
- **`Model.js`**
  - **Description**: Mongoose schema for user data.
  - **Responsibilities**: Defines the structure for user records and provides database interaction methods.


## Database Layer
This layer consists of the database itself, which stores all persistent data for the application.

- **Database Used**: MongoDB (for a NoSQL structure)

##### Key Collections:
- **`users`**: Stores user information such as credentials, personal details, and preferences.

