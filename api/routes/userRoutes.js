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
  deleteMessage,
  sentFriendRequestsHandler,
  friendsList,
} = require("../controllers/userController");
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
router.post("/friend-request/accept", acceptFriendRequest);
// endpoint to display all the friends of the loggedin user!
router.get("/friends/:userId", showAllFriends);
// endpoint to send message to a person
router.post("/messages", sendMessage);
// endpoint to get the userDetails to design the chatRoom Header!
router.get("/details/:userId", getUserDetails);
// endpoint to fetch the messages between two users in the chatRoom!
router.get("/messages/:senderId/:recepientId", fetchChats);
// endpoint to delete Message from the chatRoom
router.post("/deleteMessages", deleteMessage);
// endpint to check the sent friend request of the loggedin user
router.get("/friend-requests/sent/:userId", sentFriendRequestsHandler);
// endpoint to check the friends list of the loggedin user
router.get("/friends/:userId" , friendsList);

module.exports = router;
