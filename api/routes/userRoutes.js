const express = require("express");
const {
  registerUser,
  loginUser,
  listAllUsers,
  sendFriendRequest,
  showAllFriendRequests,
  acceptFriendRequest,
  showAllFriends,
  sendMessage,
  getUserDetails,
  fetchChats,
} = require("../controllers/userController");
const multer = require("multer");
const router = express.Router();

// endpoint for registering the users
router.post("/register", registerUser);
// endpoint for logging the user into the application!
router.post("/login", loginUser);
// endpoint to access all the users except the one who is currently logged in!
router.get("/:userId", listAllUsers);
// endpoint to send friend Request to a person!
router.post("/friend-request", sendFriendRequest);
// endpoint to show all the friend-requests of a particular user!
router.get("/friend-request/:userId", showAllFriendRequests);
// endpoint to accept the particular user friend request!
router.post('/friend-request/accept' , acceptFriendRequest);
// endpoint to display all the friends of the loggedin user!
router.get('/friends/:userId' , showAllFriends);

// configure multer for handling file uploads!
const storage = multer.diskStorage({
  destination : function ( req , file , cb) {
    cb(null , 'files'); // specify the desired destination folder
  },
  filename : function (req , file , cb) {
    // Generate a unique fileName for the uploaded file!
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null , uniqueSuffix + '-' + file.originalname);
  },
})

// endpoint to send message to a person
const upload = multer({ storage : storage }); 
router.post('/messages' , upload.single("imageFile") , sendMessage);
// endpoint to get the userDetails to design the chatRoom Header!
router.get('/details/:userId' , getUserDetails);
// endpoint to fetch the messages between two users in the chatRoom!
router.get('/messages/:senderId/:recepientId' , fetchChats);


module.exports = router;
