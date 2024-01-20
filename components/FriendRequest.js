import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext } from "react";
import { UserType } from "../context/userContext";
import { useNavigation } from "@react-navigation/native";

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {

    // State to store the logged-in user's ID
    const { userId, setUserId } = useContext(UserType);

    // navigation
    const navigation = useNavigation();

    // function for accepting the Request!
    const acceptRequest = async (friendRequestId) => {
        try {
            const response = await fetch("http://192.168.29.181:5000/user/friend-request/accept" , {
                method : "POST" , 
                headers : {
                    "Content-Type" : "application/json"
                } , 
                body : JSON.stringify({
                    senderId : friendRequestId , 
                    recepientId : userId
                })
            })

            if ( response.ok ) {
        // to remove the friend request after accepting it!
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== friendRequestId)
        );

                // navigating to the chats Screen!
                navigation.navigate("Chats");
            }
        } catch (error) {
            console.log('error accepting the friend request!' , error);
        }
    }

  return (
    <Pressable style={styles.conatiner}>
      <Image source={{ uri: item.image }} style={styles.imageStyle} />

      <Text style={styles.textStyle}>
        {item?.name} sent you a friend request!
      </Text>

      <TouchableOpacity onPress={() => acceptRequest(item._id)} style={styles.buttonStyle}>
        <Text style={styles.buttonTextStyle}>Accept</Text>
      </TouchableOpacity>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    marginHorizontal: 5,
  },
  imageStyle: {
    width: 60,
    height: 60,
    borderRadius: 25,
    resizeMode: "cover",
  },
  textStyle: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
    flex: 1,
  },
  buttonStyle: {
    backgroundColor: "#39B68D",
    padding: 10,
    borderRadius: 6,
    // marginHorizontal : 5
  },
  buttonTextStyle: {
    color: "#fff",
    textAlign: "center",
  },
});
