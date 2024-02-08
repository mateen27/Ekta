const userService = require("../services/userService");

// logic for registering the User into the backend i.e. the database!
const registerUser = async (req, res) => {
  try {
    // accessing the input values of the textField
    const { name, email, password, image } = req.body;

    // Calling a function in the service to handle database operations!
    const user = await userService.registerToDatabase(
      name,
      email,
      password,
      image
    );

    // Send a response based on the result
    res.status(201).json({ user });
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// logic for logging the Particular User which is registerd in the application!
const loginUser = async (req, res) => {
  try {
    // accessing the input values which user provided in the front-end
    const { email, password } = req.body;

    // check if the email and the password is provided
    if (!email || !password) {
      return res
        .status(404)
        .json({ message: "Email and Password are required!" });
    }

    // checking for the user in the database!
    const user = await userService.findUserByEmailAndPassword(email, password);

    // if the user is found generate the token!
    if (user) {
      // user found generate the token
      const token = userService.generateToken(user._id);

      res.status(200).json({ user, token });
    } else {
      // user not found or invalid credentials
      res.status(404).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login!", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for accessing all the users from the database except the currently loggedin user!
const listAllUsers = async (req, res) => {
  try {
    // accessing the logged in user's ID
    const loggedInUserId = req.params.userId;

    // Making the query in the database where _id does not include the loggedInUserId
    const users = await userService.listAllUsersExceptLoggedIn(loggedInUserId);

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error handling request!", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

// logic for sending the friend-request!
const sendFriendRequest = async (req, res) => {
  try {
    // accessing the userId of the loggedin user , and the id of the reciepient!
    const { currentUserId, selectedUserId } = req.body;

    // Update sender's details (for example, add recipientId to their friend requests sent list)
    await userService.updateSenderDetails(currentUserId, selectedUserId);

    // Update the recipient's details { example , add senderId to their friend requests received list}
    await userService.updateRecipientDetails(selectedUserId, currentUserId);

    res
      .status(200)
      .json({ success: true, message: "Friend request sent successfully." });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// Logic for show all the friend requests of a particular user!
const showAllFriendRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    // fetch the user document based on the UserID
    const user = await userService.showAllFriendRequests(userId);

    // Send the user document with friend requests back to the client
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Logic for accepting a particular user friend-request!
const acceptFriendRequest = async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    // retrieve the document of sender and recepient!
    await userService.acceptFriendRequests(senderId, recepientId);

    // Send a success response to the client
    res.status(200).json({
      success: true,
      message: "Friend request accepted successfully.",
    });
  } catch (error) {
    // Proper error handling and response
    console.error("Error accepting friend request:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// function to show all the friends of the loggedin user!
const showAllFriends = async (req, res) => {
  try {
    // accessing the paramaters to get the UserId
    const { userId } = req.params;

    //  finding the user exist or not in the database!
    const user = await userService.listOfFriends(userId);

    const acceptedFriends = user.friends;

    res.status(200).json(acceptedFriends);
  } catch (error) {
    // Proper error handling and response
    console.error("Error in retrieving friends:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// function to send message to a person!
const sendMessage = async (req, res) => {
  try {
    const { senderId, recipientId, messageType, messageText, imageUrl } =
      req.body;

    console.log("userID", senderId);
    console.log("recepientId", recipientId);
    await userService.sendMessage(
      senderId,
      recipientId,
      messageType,
      messageText,
      imageUrl
    );

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// function to fetch the userDetails of a person!
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // fetch the user Data from the userId
    const response = await userService.getUserDetailsService(userId);

    if (response) {
      res.json(response);
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// // endpoint to fetch the messages between two users in the chatRoom!
const fetchChats = async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;

    const message = await userService.fetchChatsService(senderId, recepientId);

    res.json(message);
  } catch (error) {
    console.error("Error fetching Chats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// endpint to delete the messages between two users in the chatRoom
const deleteMessage = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No messages to delete!" });
    }

    const message = await userService.deleteMessages(messages);

    if (message) {
      res.json({ message: "Message deleted successfully!" });
    }
  } catch (error) {
    console.error("Error Deleting Messages:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// Endpoint to check the sentFriendsRequests
const sentFriendRequestsHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    // checking if the user exists in the database
    const sentRequests = await userService.getSentFriendRequests(userId);
    
    res.json(sentRequests);
  } catch (error) {
    console.error("Error fetching sent friend requests!:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// endpoint to check the friends of the particular user
const friendsList = async (req, res) => {
  try {
    const { userId } = req.params;

    // checking if the user exists in the database
    const friendLists = await userService.getFriendsList(userId);
    
    res.json(friendLists);
  } catch (error) {
    console.error("Error fetching friends list of the particular user!:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
}

module.exports = {
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
  friendsList
};
