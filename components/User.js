import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../context/userContext";

const User = ({ item }) => {
  // accessing the UserID!
  const { userId, setUserId } = useContext(UserType);

  // state management
  const [requestSent, setRequestSent] = useState(false);
  const [sentFriendRequests, setSentFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);

  // for fetching the sent friend requests
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `http://192.168.29.181:5000/user/friend-requests/sent/${userId}`
        );

        const data = await response.json();

        if (response.ok) {
          setSentFriendRequests(data);
        } else {
          console.log("error fetching friend requests", response.status);
        }
      } catch (error) {
        console.log("error fetching FriendRequests!", error);
      }
    };

    fetchFriendRequests();
  }, []);

  console.log("friend requests", sentFriendRequests);
  console.log("user-friends" , userFriends);

  // for fetching the friends of the current logged in users
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `http://192.168.29.181:5000/user/friends/${userId}`
        );

        const data = await response.json();

        if (response.ok) {
          setUserFriends(data);
        } else {
          console.log("error fetching friends of the user", response.status);
        }
      } catch (error) {
        console.log("error fetching friends of the user!", error);
      }
    };

    fetchFriends();
  }, []);

  // function for sending the friendRequests!
  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      // hitting the backend API to sendFriend Requests!
      // using fetch method!
      const response = await fetch(
        `http://192.168.29.181:5000/user/friend-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentUserId, selectedUserId }),
        }
      );

      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("error message : ", error);
    }
  };

  return (
    <Pressable style={styles.container}>
      {/* View for holding the User Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.userImageStyle} />
      </View>

      {/* View for the user Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.nameTextStyle}>{item?.name}</Text>
        <Text style={styles.emailTextStyle}>{item?.email}</Text>
      </View>

      {/* <TouchableOpacity for sending the FirendRequest! */}
      {userFriends.some((friend) => friend._id === item._id) ? (
        <TouchableOpacity
          style={{
            backgroundColor: "#2d7e8f",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Friends</Text>
        </TouchableOpacity>
      ) : requestSent || sentFriendRequests.some((friend) => friend._id === item._id) ? (
        <TouchableOpacity
          style={{
            backgroundColor: "#333",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Request Sent
          </Text>
        </TouchableOpacity>
      ) : (
        <Pressable
          onPress={() => sendFriendRequest(userId, item._id)}
          style={{
            backgroundColor: "#2d8f6f",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Add Friend
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 15,
    alignItems: "center",
  },
  imageContainer: {
    marginHorizontal: 12,
  },
  userImageStyle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    resizeMode: "cover",
  },
  infoContainer: {
    marginHorizontal: 5,
    flex: 1,
  },
  nameTextStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
  emailTextStyle: {
    color: "gray",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 5,
  },
  friendRequestButton: {
    backgroundColor: "#39B68D",
    padding: 10,
    borderRadius: 6,
    width: 100,
  },
  buttonTextStyle: {
    textAlign: "center",
    color: "#f1f1f1",
    fontSize: 13,
  },
});
