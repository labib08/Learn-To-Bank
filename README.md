# Demo
Link to the website: [https://learn-to-bank.onrender.com](https://learn-to-bank-md60.onrender.com/) <br>
<br>
Dummy account information: <br>
<br>
Username: jack08 <br>
password: asd <br>

**Link to the Original Repository:** <br>
[Click Here](https://github.com/SahilUnimelb/FinTech-FLAMES)
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
# Team members
Itmam Khan Labib - Frontend <br>
Andre Chiang - Frontend <br>
Mitchell - Backend <br>
Fischer - Backend <br>
Sahil - Backend <br>
