const express = require('express');
const session = require("express-session");
const path = require('path');
const isAuthenticated = require('./middlewares/isAuthenticated.js')

const app = express();
const port = 3000; // You can change this to any port you prefer

// parse json
app.use(express.json())

app.use(session({ resave: false, secret: '123456', saveUninitialized: true }));
// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const userRoute = require("./api/user/user");
const employeeRoute = require("./api/employee/employee");
const treatmentRoute = require("./api/treatment/treatment");
const appointmentRoute = require("./api/appointment/appointment");

app.use("/user", userRoute);
app.use("/employee", employeeRoute)
app.use("/treatment", treatmentRoute)
app.use("/appointment", appointmentRoute)

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


// Route for the home page
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
