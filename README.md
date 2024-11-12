# FinTech-FLAMES
This is the main branch of FinTech-Flames Learn-To-Bank simulation website <br/>
# Table of Contents
1. [Project Overview](#project-overview)
   - [Description of key classes](#description-of-key-classes)
      - [BackEnd](#backend)
      - [FrontEnd](#frontend)
   - [Description of Database Structure](#database-structure)
3. [Demo](#demo)
4. [Features](#features)
   - [Sprint 1](#sprint-1-basic-account-management-and-setup)
   - [Sprint 2](#sprint-2-simulated-banking-and-transactions)
   - [Sprint 3](#sprint-3-transaction-history-and-administration)
   - [Sprint 4](#sprint-4-user-assistance-and-additional-features)
5. [Documentation](#documentation)
   - [Architecture](#architecture-system-diagram)
   - [Domain Model](#domain-model)
   - [Motivational Model](#motivational-model)
   - [Non Functional Considerations](#nonfunctional-considerations)
   - [User Stories](#user-stories)
   - [Test Cases](#test-cases)
6. [Installation Guide](#installation)
   - [Dependencies](#additional-dependencies-to-install)
7. [Changelog](#changelog)
8. [Deployment](#deployment)
# Project Overview
### Description of Key Classes
- #### [Backend](Backend/README.md)
- #### [Frontend](FrontEnd/README.md)
(remove this line when you finish, create a read me in the front end talking about the structure of the code and then link it)
### Database Structure
- [Database Structure Readme](Backend/models/README.md)

# Demo
Link to the website: [https://learn-to-bank.onrender.com](https://learn-to-bank-md60.onrender.com/)
# Features
### Sprint 1: Basic Account Management and Setup
**Goal:** Implement fundamental account functionality, including signup, login, and basic account management.

- **Epic 1: Sign-Up, Login, and Account Management**
   - **User Story 1**: As a user, I want to create an account to access the system. **(High Priority)**
   - **User Story 2**: As a user, I want to log in and out of my account. **(High Priority)**
   - **User Story 3**: As a user, I want the option to delete my own account at any time. **(High Priority)**
   - **User Story 4**: As a user, I want to set up additional authenticators for security. **(Low Priority)**
   - **User Story 5**: As a user, I want the ability to reset my password through email verification. **(Low Priority)**

---

### Sprint 2: Simulated Banking and Transactions
**Goal:** Begin implementing core banking functions like balance viewing, payments, and notifications.

- **Epic 2: Simulated Banking**
   - **User Story 1**: As a user, I want to view my updated account balance. **(High Priority)**
   - **User Story 2**: As a user, I want to make payments to other users. **(High Priority)**
   - **User Story 3**: As a user, I want to schedule payments for future dates. **(High Priority)**
   - **User Story 4**: As a user, I want to earn interest on my savings account at intervals. **(Medium Priority)**

---

### Sprint 3: Transaction History and Administration
**Goal:** Build a feature for users to view and export transaction history and provide admin functionalities.

- **Epic 3: Transaction History**
   - **User Story 1**: As a user, I want to see my previous transactions. **(Medium Priority)**
   - **User Story 2**: As a user, I want to export my transaction history as a PDF. **(Medium Priority)**
   - **User Story 3**: As a user, I want to search for specific transactions. **(Low Priority)**
   - **User Story 4**: As a user, I want to save accounts I’ve transacted with before. **(Low Priority)**

- **Epic 4: Administrative Rights**
   - **User Story 1**: As an admin, I want to delete non-administrative accounts. **(Medium Priority)**
   - **User Story 2**: As an admin, I want to reactivate deactivated user accounts. **(Medium Priority)**
   - **User Story 3**: As an admin, I want to manage other accounts’ funds. **(Low Priority)**

---

### Sprint 4: User Assistance and Additional Features
**Goal:** Introduce quality-of-life features and provide users with guidance and support.

- **Epic 5: Extensions**
   - **User Story 1**: As a user, I want to interact with a ChatBot for immediate assistance. **(Low Priority)**
   - **User Story 2**: As a user, I want instructions displayed on-screen to guide transactions. **(Low Priority)**

# Documentation
- ### [Architecture System Diagram](Docs/ArchitectureSystemDiagram.pdf)
- ### [Domain Model](Docs/DomainModel.pdf)
- ### [Motivational Model](Docs/MotivationalModel.pdf)
- ### [NonFunctional Considerations](Docs/NonFunctionalConsiderations.pdf)
- ### [User Stories](Docs/UserStories.pdf)
- ### [Test Cases](Docs/TestCases.pdf)

# Installation
To begin, please follow the steps below for installing Npm and Node and setting up the server and database:
## Download Node and Npm
Download the latest version of Node from the official website.
[Download Here](https://nodejs.org/en)
## Install Npm 
Open the terminal and run the following command:
```
npm install
```
## Install Npm 
On the terminal run the following command:
```
npm install express --save
```
## Install React Router
For this project the router dependency needs to be installed. On the terminal run the following command:
```
npm install react-router-dom
```
## Install MongoDB
Download MongoDB from the official website.
[Download Here](https://www.mongodb.com/docs/manual/administration/install-community/)

Then install and run as a service
[Install Here](https://brandonblankenstein.medium.com/install-and-run-mongodb-on-mac-1604ae750e57)

## Additional Dependencies to install
If these dependencies are not installed on the machine, install them using these commands on terminal:

1. Json Web Token
```
npm install jsonwebtoken
```
2. Mongoose
```
npm install mongoose
```
3. Cors
```
npm install cors
```
4. Nodemailer
```
npm install nodemailer
```
5. Speakeasy
```
npm install speakeasy
```
6. Jest
```
npm install Jest
```

# Start the app
To start the app do the following depending on the machine:
# MacOS
Open up three terminal windows, for frontend, backend and database
## Frontend
Make sure you are in the frontend directory
```
cd FinTech-FLAMES/Frontend
```
Run the frontend
```
npm start
```
## Backend
Make sure you are in the frontend directory
```
cd FinTech-FLAMES/Backend
```
Run the backend
```
node server.js
```
Trouble shooting purpose only: If the above command doesn't work, run:
```
npm install bcrypt
```
and then the first command again
## Database
Run MongoDB:
```
mongod --dbpath ~/data/db
```
Optional if the above command does not work:
```
mkdir -p ~/data/db
```
Then run the first command again
# Windows
## Frontend
Open up a terminal and ensure it is located in the Frontend directory
```
cd FinTech-FLAMES/Frontend
```
Run the frontend
```
npm start
```
## Backend
Open up a terminal and ensure it is located in the Backend directory
```
cd FinTech-FLAMES/Backend
```
Run NodeJs for the backend in the terminal
```
node server.js
```
## Database
Run MongoDB:
```
mongod --port 27017 --dbpath "C:\MongoDB\data\db"
```
Optional if the above command does not work:
```
mkdir C:\data\db
```
Then run the first command again

# Changelog
 [Changelog](https://github.com/SahilUnimelb/FinTech-FLAMES/blob/main/changelog.md)

# Deployment
 [Deployment](https://github.com/SahilUnimelb/FinTech-FLAMES/blob/main/deployment.md)

