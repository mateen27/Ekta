import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
// icons
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../context/userContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const ChatMessageScreen = () => {
  // state management
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  // for holding recepient Data from api call
  const [recepientData, setRecepientData] = useState();
  const [loading, setLoading] = useState(true);
  // for holding the chat messages data
  const [messages, setMessages] = useState([]);

  const [messageState, setMessageState] = useState("");

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

  // function to pick Image from the Gallery
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // Upload the image to Cloudinary
        const cloudinaryLink = await uploadImageToCloudinary(
          result.assets[0].uri
        );

        // Send the Cloudinary link through handleSend
        if (cloudinaryLink) {
          handleSend("image", cloudinaryLink);
        } else {
          console.log("Error in getting the cloudinary link");
        }
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
    try {
      const data = new FormData();
      data.append("file", {
        uri: imageUri,
        type: `image/${imageUri.split(".").pop()}`,
        name: `test.${imageUri.split(".").pop()}`,
      });
      data.append("upload_preset", "ShowStarter");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dvvnup3nh/image/upload",
        {
          method: "post",
          body: data,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const cloudinaryData = await response.json();
        if (cloudinaryData.secure_url) {
          console.log(
            "Image uploaded to Cloudinary: ",
            cloudinaryData.secure_url
          );
          return cloudinaryData.secure_url;
        }
      }

      console.log("Image upload to Cloudinary failed");
      return null;
    } catch (error) {
      console.error("Error uploading to Cloudinary: ", error);
      return null;
    }
  };

  const fetchRecepientData = async () => {
    try {
      const response = await fetch(
        `http://192.168.29.181:5000/user/details/${recepientId}`
      );
      const data = await response.json();
      if (data) {
        setRecepientData(data);
      } else {
        console.log("no data in recepient");
      }
    } catch (error) {
      console.log("error retrieving details", error);
    } finally {
      setLoading(false);
    }
  };

  // function for fetching the messages from the api
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://192.168.29.181:5000/user/messages/${userId}/${recepientId}`
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
    fetchRecepientData();
    fetchMessages();
  }, []);

  useLayoutEffect(() => {
    if (!loading) {
      navigation.setOptions({
        headerTitle: "",
        headerLeft: () => (
          <View style={styles.headerContainer}>
            <Ionicons
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
              color="#f1f1f1"
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={styles.imageStyle}
                source={{ uri: recepientData?.image }}
              />
              <Text style={styles.textStyle}>{recepientData?.name}</Text>
            </View>
          </View>
        ),
      });
    }
  }, [navigation, recepientData, loading]);

  // function to send message
  // const handleSend = async (messageType, imageUri) => {
  //   try {
  //     const formData = new FormData();
  //     // user id
  //     formData.append("senderId", userId);
  //     // recepient id
  //     formData.append("recipientId", recepientId);

  //     console.log("userId:", userId);
  //     console.log("recipientId:", recepientId);
  //     console.log("messageType:", messageType);

  //     // if the message type id image or normal text
  //     if (messageType === "image") {
  //       formData.append("messageType", "image");
  //       // Assuming 'imageUri' is the result from ImagePicker
  //     const imageFile = {
  //       uri: imageUri,
  //       name: "image.jpg",
  //       type: "image/jpeg",
  //     };

  //     formData.append("imageFile", imageFile.uri);
  //     } else {
  //       formData.append("messageType", "text");
  //       formData.append("messageText", messageText);
  //     }

  //     const response = await fetch("http://192.168.29.181:5000/user/messages", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //       body: formData,
  //     });

  //     console.log("formData", formData);

  //     if (response.ok) {
  //       setMessageText("");
  //       setSelectedImage("");

  //       // call the api to fetch the messages from the backend
  //       // fetchMessages();
  //     }
  //   } catch (error) {
  //     console.log("error in sending the message!", error);
  //   }
  // };
  const handleSend = async (messageType, imageUri) => {
    try {
      const data = {
        senderId: userId,
        recipientId: recepientId,
        messageType: messageType,
        messageText: messageType === "text" ? messageText : null,
        imageUrl: messageType === "image" ? imageUri : null,
      };

      console.log("data", JSON.stringify(data));

      //       console.log("userId:", userId);
      // console.log("recipientId:", recepientId);
      // console.log("messageType:", messageType);

      const response = await fetch("http://192.168.29.181:5000/user/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessageText("");
        setSelectedImage("");
        // call the API to fetch the messages from the backend
        fetchMessages();
      }
    } catch (error) {
      console.log("Error in sending the message!", error);
    }
  };

  // for recepient data
  // console.log("recepient data from api call", recepientData);
  // for message
  // console.log('messages' , messages);

  // function to format Time
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        {/* all the chats messages goes over here! */}
        {messages.map((item, index) => {
          // for the text
          if (item.messageType === "text") {
            return (
              <Pressable
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? styles.senderMessageStyle
                    : styles.receiverMessageStyle,
                ]}
              >
                <Text style={styles.textMessageStyle}>{item?.message}</Text>
                <Text style={styles.timeTextStyle}>
                  {formatTime(item?.timeStamp)}
                </Text>
              </Pressable>
            );
          }

          // // for the image
          const source = item?.imageUrl;
          if (item.messageType === "image") {
            return (
              <Pressable
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? styles.senderMessageStyle
                    : styles.receiverMessageStyle,
                ]}
              >
                <View>
                  <Image
                    source={{ uri: source }}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                    resizeMode="contain"
                    onError={(error) =>
                      console.error("Image load error:", error)
                    }
                  />

                  <Text style={styles.timeTextStyle}>
                    {formatTime(item?.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }
        })}
      </ScrollView>

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
        <Feather
          onPress={pickImage}
          name="camera"
          size={24}
          color="#f1f1f1f1"
        />

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
  imageStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textStyle: {
    fontSize: 15,
    color: "#f1f1f1",
    marginLeft: 15,
    fontWeight: "900",
  },
  senderMessageStyle: {
    alignSelf: "flex-end",
    backgroundColor: "#39B68D",
    padding: 8,
    maxWidth: "70%",
    borderRadius: 8,
    margin: 5,
  },
  receiverMessageStyle: {
    alignSelf: "flex-start",
    backgroundColor: "#39B68D",
    padding: 8,
    margin: 5,
    borderRadius: 7,
    maxWidth: "70%",
  },
  textMessageStyle: {
    fontSize: 17,
    color: "#fff",
    textAlign: "left",
  },
  timeTextStyle: {
    textAlign: "right",
    fontSize: 11,
    color: "black",
    // position : 'absolute' ,
    // right : 1 ,
    // bottom : 1 ,
    // marginTop : 5
  },
  imageTimeStyle: {
    textAlign: "right",
    fontSize: 11,
    color: "black",
    // position : 'absolute' ,
    // right : 1 ,
    // bottom : 1 ,
    // marginTop : 5
  },
});
