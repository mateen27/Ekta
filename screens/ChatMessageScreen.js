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

const ChatMessageScreen = () => {
  // state management
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  // for holding recepient Data from api call
  const [recepientData, setRecepientData] = useState();
  const [loading, setLoading] = useState(true);
  // for holding the chat messages data
  const [messages , setMessages] = useState([]);

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
      const response = await fetch(`http://192.168.29.181:5000/user/messages/${userId}/${recepientId}`);

      const data = await response.json();

      // console.log('data' , data)

      if(response.ok) {
        setMessages(data); 
      } else {
        console.log('error showing messages' , response.status.message); 
      }
    } catch (error) {
      console.log('error fetching messages!' , error);
    }
  }

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

        // call the api to fetch the messages from the backend
        fetchMessages();
      }
    } catch (error) {
      console.log("error in sending the message!", error);
    }
  };

  // for recepient data
  // console.log("recepient data from api call", recepientData);
  // for message
  // console.log('messages' , messages);

  // function to format Time
  const formatTime = (time) => {
    const options = { hour : "numeric" , minute : "numeric" }
    return new Date(time).toLocaleString("en-US",options)
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        {/* all the chats messages goes over here! */}
        {messages.map((item , index) => {
          if(item.messageType === 'text') {
            return (
              <Pressable key={index} style = { [ item?.senderId?._id === userId ? styles.senderMessageStyle : styles.receiverMessageStyle ] }>
                <Text style = { styles.textMessageStyle }>{item?.message}</Text>
                <Text style = { styles.timeTextStyle }>{formatTime(item?.timeStamp)}</Text>
              </Pressable>
            )
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
  senderMessageStyle : {
    alignSelf : 'flex-end' , 
    backgroundColor : '#39B68D' , 
    padding : 8 , 
    maxWidth : '70%' , 
    borderRadius : 8 , 
    margin : 5
  } , 
  receiverMessageStyle : {
    alignSelf : 'flex-start' , 
    backgroundColor : '#39B68D' , 
    padding : 8 , 
    margin : 5 , 
    borderRadius : 7 , 
    maxWidth : '60%'
  } , 
  textMessageStyle: {
    fontSize : 17 , 
    color : '#fff' , 
    textAlign : "left"
  } , 
  timeTextStyle : {
    textAlign : 'right' , 
    fontSize : 11 , 
    color : 'black' ,
  }
});
