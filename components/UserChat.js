import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useLayoutEffect, useEffect, useState } from "react";
// icon
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../context/userContext";

const UserChat = ({ item }) => {
  // navigation
  const navigation = useNavigation();

  // for accesing the user ID
  const { userId, setUserId } = useContext(UserType);
  // for holding the chat messages data
  const [messages, setMessages] = useState([]);

  // function for fetching the messages from the api
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://192.168.29.181:5000/user/messages/${userId}/${item._id}`
      );

      const data = await response.json();

      // console.log('data' , data)

      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messages", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages!", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // function to get the last Message
  const getLastMessage = () => {
    // filtering out the image messages from the chat!
    const userMessages = messages.filter(
      (message) => message.messageType === "text"
    );

    // calculating the length of the messages
    const length = userMessages.length;

    // accessing the last message
    return userMessages[length - 1];
  };

    // function to format Time
    const formatTime = (time) => {
      const options = { hour: "numeric", minute: "numeric" };
      return new Date(time).toLocaleString("en-US", options);
    };

  // accessing the last message
  const lastMessage = getLastMessage();
  console.log("lastMessage", lastMessage);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.rightIconsContainer}>
          <AntDesign name="addusergroup" size={22} color="#D5D5D5" />
          <Text style={{ color: "#D5D5D5" }}>New Group</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("Message", {
          recepientId: item._id,
        })
      }
    >
      <Image source={{ uri: item?.image }} style={styles.imageStyle} />

      {/* View for the name */}
      <View style={{ flex: 1 }}>
        <Text style={styles.textStyle}>{item?.name}</Text>
        {lastMessage && (
          <Text
            style={[
              styles.textStyle,
              { color: "gray", fontWeight: "600", fontSize: 12, marginTop: 4 },
            ]}
          >
            {lastMessage?.message}
          </Text>
        )}
      </View>

      {/* VIew for the timing of the Message! */}
      <View>
        <Text style={styles.timeTextStyle}>
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserChat;

const styles = StyleSheet.create({
  container: {
    // flex : 1 ,
    // backgroundColor : 'black'
    padding: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 0.7,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: "#D0D0D0",
    // marginVertical : 5
  },
  textStyle: {
    color: "#f1f1f1",
    fontWeight: "900",
    fontSize: 14,
  },
  imageStyle: {
    width: 60,
    height: 60,
    borderRadius: 25,
    resizeMode: "cover",
  },
  timeTextStyle: {
    color: "#585858",
    fontWeight: "400",
    fontSize: 12,
  },
  rightIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto", // Move icons to the right
    gap: 5,
    backgroundColor: "#222",
    padding: 5,
    borderRadius: 5,
    elevation: 10,
  },
});
