const express = require('express');
const session = require("express-session");
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config()


const app = express();
const port = process.env.PORT; // You can change this to any port you prefer

// parse json
app.use(express.json())
app.use(session({ resave: false, secret: '123456', saveUninitialized: true }));

// managing cross origin requests and accepting only frontend port request
const corsOptions = {
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
  credentials: true
}

app.use(cors(corsOptions))

// Routes
const userRoute = require("./api/user/user.routes");
const employeeRoute = require("./api/employee/employee.routes");
const treatmentRoute = require("./api/treatment/treatment.routes");
const appointmentRoute = require("./api/appointment/appointment.routes");

app.use("/api/user", userRoute);
app.use("/api/employee", employeeRoute)
app.use("/api/treatment", treatmentRoute)
app.use("/api/appointment", appointmentRoute)

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
