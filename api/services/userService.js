const User = require("../models/User");
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");

// function for Saving the User to the Database!
const registerToDatabase = async (name, email, password, image) => {
  // Logic for registering the user in the database
  try {
    const newUser = new User({ name, email, password, image });
    await newUser.save();
    return { message: "User registered successfully!" };
  } catch (error) {
    console.error(`Error Registering the User! : ${error}`);
    throw new Error("Error registering the User!");
  }
};

// function for finding the user based on email and password
const findUserByEmailAndPassword = async (email, password) => {
  // logic for finding the user in the database!
  try {
    const user = await User.findOne({ email, password });

    return user;
  } catch (error) {
    console.log("Error finding user: ", error);
    throw new Error("Error finding the user!");
  }
};

// function for generating the token!
const generateToken = (userId) => {
  const secretKey = process.env.SECRET_KEY;
  const expiresIn = 3 * 24 * 60 * 60; // Token expiration time [3 Days]

  return jwt.sign({ userId }, secretKey, { expiresIn });
};

// function for listing all the users except loggedin user!
const listAllUsersExceptLoggedIn = async (loggedInUserId) => {
  try {
    // Assuming you have a User model
    const users = await User.find({ _id: { $ne: loggedInUserId } });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
};

// function for Updating sender's details [ for the friend Request ]
const updateSenderDetails = async (currentUserId, recipientUserId) => {
  try {
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: recipientUserId },
    });
  } catch (error) {
    throw new Error("Error updating sender's details");
  }
};

// function for Updating recipient's details [ for the friend Request ]
const updateRecipientDetails = async (recipientUserId, currentUserId) => {
  try {
    await User.findByIdAndUpdate(recipientUserId, {
      $push: { friendRequests: currentUserId },
    });
  } catch (error) {
    throw new Error("Error updating recipient's details");
  }
};

// function to fetch all the friend requests of the particular user!
const showAllFriendRequests = async (userId) => {
  try {
    return await User.findById(userId)
      .populate("friendRequests", "name email image")
      .lean();
  } catch (error) {
    throw new Error("Error showing all the friend's request's");
  }
};

// function to accept FriendRequests of the user!
const acceptFriendRequests = async (senderId, recepientId) => {
  try {
    // checking if the id's are valid or not!
    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    // Ensure that both sender and recipient exist
    if (!sender || !recepient) {
      throw new Error("Invalid sender or recipient ID.");
    }

    // pushing the id's into the friends field in the database!
    sender.friends.push(recepientId);
    recepient.friends.push(senderId);

    // removing the id's from sentFriendRequest and friendRequest!
    recepient.friendRequests = recepient.friendRequests.filter(
      (requests) => requests.toString() !== senderId.toString()
    );

    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (requests) => requests.toString() !== recepientId.toString()
    );

    // Save the changes to the database
    await sender.save();
    await recepient.save();
  } catch (error) {
    // Proper error handling and rethrow the error
    console.error("Error accepting friend requests:", error);
    throw error;
  }
};

// function to find the id exist and return all the friends of the particular user!
const listOfFriends = async (userId) => {
  try {
    return await User.findById(userId).populate("friends", "name email image");
  } catch (error) {
    // Proper error handling and rethrow the error
    console.error("Error retrieving friends :", error);
    throw error;
  }
};

// function to send Message
const sendMessage = async (
  senderId,
  recipientId,
  messageType,
  messageText,
  imageUrl
) => {
  try {
    const newMessage = new Message({
      senderId,
      recipientId,
      messageType,
      message: messageText,
      timeStamp: new Date(),
      imageUrl,
    });

    return await newMessage.save(); // Save the newMessage to the database
  } catch (error) {
    // Handle the error appropriately
    console.error("Error sending message:", error);
    throw error;
  }

  // console.log('userID',userId);
  // console.log('recepient ID',recepientId);
};

// function to fetch the userDetails by the userId
const getUserDetailsService = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    // Handle the error appropriately
    console.error("Error fetching user details:", error);
    throw error;
  }
};

// endpoint to fetch the messages between two users in the chatRoom!
const fetchChatsService = async (senderId, recepientId) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: senderId, recipientId: recepientId },
        { senderId: recepientId, recipientId: senderId },
      ],
    }).populate("senderId", "_id name");

    return messages;
  } catch (error) {
    // Handle the error appropriately
    console.error("Error fetching user details:", error);
    throw error;
  }
};

module.exports = {
  registerToDatabase,
  findUserByEmailAndPassword,
  generateToken,
  listAllUsersExceptLoggedIn,
  updateSenderDetails,
  updateRecipientDetails,
  showAllFriendRequests,
  acceptFriendRequests,
  listOfFriends,
  sendMessage,
  getUserDetailsService,
  fetchChatsService,
};
