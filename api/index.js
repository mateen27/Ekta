const express = require("express");
const bodyParser = require("body-parser");
const moongoose = require("mongoose");
const dotenv = require("dotenv").config();
// authentication middleware for NodeJS
const passport = require("passport");
// used to handle local username and password in our app
const localStrategy = require("passport-local").Strategy;
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Adjust the limit as needed
app.use(passport.initialize());

const jwt = require("jsonwebtoken");
const { connectToDatabase } = require("./database/db");

// connect to the Database
connectToDatabase();

// endpoint for the registeration of the User!
app.use("/user", userRoutes);
// endpoint for logging the User!
app.use("/user", userRoutes);
// endpoint to access all the users except the one who is currently logged in!
app.use("/user", userRoutes);
// endpoint to send friend Request!
app.use("/user", userRoutes);
// endpoint to show all the friend-requests of a particular user!
app.use("/user", userRoutes);
// endpoint to accept the friend-request of a particular user!
app.use('/user' , userRoutes);
// endpoint to show all the friends of the logged-in user!
app.use('/user' , userRoutes);
// endpoint to send the message to the person!
app.use('/user' , userRoutes);
// endpoint to get the userDetails to design the Chat Room Header!
app.use('/user' , userRoutes);
// endpoint to fetch the messages between two users in the chatRoom!
app.use('/user' , userRoutes);
// endpoint to delete the messages between two users in the chatRoom
app.use('/user' , userRoutes);
// endpoint to check for the sent friend-request of a particular user
app.use('/user' , userRoutes);
// endpoint to check the friends of a particular user
app.use('/user' , userRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on PORT : ${PORT}`);
});
