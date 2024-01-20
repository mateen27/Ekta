import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../context/userContext";
import FriendRequest from "../components/FriendRequest";

const FriendsScreen = () => {
  // for accessing the userID
  const { userId, setUserId } = useContext(UserType);

  // state management
  const [friendRequests, setFriendRequests] = useState([]);

  // calling the fetch friendRequests function!
  useEffect(() => {
    fetchFriendRequests();
  }, []);

  // function for fetching the friend Requests using the backend API!
  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://192.168.29.181:5000/user/friend-request/${userId}`
      );
      // console.log("response data",response.data.user.friendRequests);

      if (response.status === 200) {
        const friendRequestsData = response.data.user.friendRequests?.map(
          (friendRequest) => ({
            _id: friendRequest._id,
            name: friendRequest.name,
            email: friendRequest.email,
            image: friendRequest.image,
          })
        );

        setFriendRequests(friendRequestsData);
      }
    } catch (error) {
      console.log("Error fetching the friend-requests!", error);
    }
  };

  // console.log(friendRequests);
  return (
    <View style={styles.container}>
      {friendRequests.length > 0 && (
        <Text style={{ color: "white", fontSize: 14, fontWeight: "700" }}>
          Your Friend Requests!
        </Text>
      )}

      {friendRequests.map((item, index) => (
        <FriendRequest
          item={item}
          key={index}
          friendRequests={friendRequests}
          setFriendRequests={setFriendRequests}
        />
      ))}
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 15,
  },
});
