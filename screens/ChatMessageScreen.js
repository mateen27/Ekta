import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
// icons
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../context/userContext";
import { useNavigation, useRoute } from "@react-navigation/native";

const ChatMessageScreen = () => {
  // state management
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  //   const [messageState, setMessageState] = useState("");

  //   navigation
  const navigation = useNavigation();

  // for accesing the user ID
  const { userId, setUserId } = useContext(UserType);

  const route = useRoute();

  const { recepientId } = route.params;

  // function to select and unselect [open and close the emoji selector options!]
  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  // function to send message
  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      // user id
      formData.append("senderId", userId);
      // recepient id
      formData.append("recepientId", recepientId);

      // if the message type id image or normal text
      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", messageText);
      }

      const response = await fetch("http://192.168.29.181:5000/user/messages", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessageText("");
        setSelectedImage("");
      }
    } catch (error) {
      console.log("error in sending the message!", error);
    }
  };

  // designing the header of the screen!
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View>
          <Ionicons name="arrow-back" size={24} color="#f1f1f1" />

        {/* Image of the user */}
          <Image source={{ uri : }}/>
        </View>
      ),
    });
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>{/* all the chats messages goes over here! */}</ScrollView>

      {/* for the emojis , textField and the sendButton */}
      <View style={styles.textContainer}>
        {/* for the emoji in left */}
        <Entypo
          name="emoji-happy"
          size={24}
          color="#f1f1f1f1"
          onPress={handleEmojiPress}
        />

        {/* TextField */}
        <TextInput
          value={messageText}
          onChangeText={(message) => setMessageText(message)}
          placeholder="Type your message..."
          style={styles.textInputStyle}
          placeholderTextColor={"#f1f1f1f1"}
        />

        {/* for the icon of camera and send button*/}
        <Feather name="camera" size={24} color="#f1f1f1f1" />

        <Feather name="mic" size={24} color="#f1f1f1f1" />

        <TouchableOpacity>
          <FontAwesome
            onPress={() => handleSend("text")}
            name="send"
            size={24}
            color="#39B68D"
            style={{ marginLeft: 1, marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>

      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessageState((prevMessage) => prevMessage + emoji);
          }}
          style={styles.emojiStyle}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  textInputStyle: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    color: "white",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
    borderTopWidth: 1,
    borderColor: "gray",
    // marginBottom : 10
  },
  emojiStyle: {
    height: 350,
  },
});
