import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

// icons
import { Ionicons } from "@expo/vector-icons";
import { UserType } from "../context/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import JWT from "expo-jwt";
import secretKey from "../private/secretKey";
import User from "../components/User";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  // navigation
  const navigation = useNavigation();

  // State to store the logged-in user's ID
  const { userId, setUserId } = useContext(UserType);

  // State to store the fetched users
  const [users, setUsers] = useState([]);

    // fetching all the users
    useEffect(() => {
      // calling the function
      fetchUsers();
    }, []);

    const fetchUsers = async () => {
      try {
        // Accessing the token from async-storage
        const token = await AsyncStorage.getItem("authToken");
        // console.log("token", token);

        // const secretKey = secretKey;
        // Decoding the token using jwt-decode package
        const decodedToken = await JWT.decode(token, secretKey);

        if (decodedToken && decodedToken.iat) {
          // Token decoded successfully, you can use the decoded information
          console.log("Decoded Token : ", decodedToken);

          const userId = await decodedToken.userId;
          // console.log(decodedToken.userId);

          // Set the logged-in user's ID
          setUserId(userId);

          // Hitting the backend API to fetch all the users except the logged-in user
          const response = await axios.get(
            `http://192.168.29.181:5000/user/${userId}`
          );

          console.log("response log", response.data);

          const userList = await response.data.users;
          // console.log("userLiat" , userList);

          // Assuming your API response contains a property 'users' with the list of users
          setUsers(userList);
        } else {
          // Handle decoding error
          console.log("Error decoding token");
        }
      } catch (error) {
        // handling the errors!
        console.error("Error fetching users:", error);
        navigation.replace('Login');
      }
    };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: { backgroundColor: "#191919" },
      headerLeft: () => (
        <View style={styles.headerContainer}>
          <Image
            source={require("../images/loogo.png")}
            style={styles.imageStyle}
            resizeMode="contain"
          />
        </View>
      ),
      headerRight: () => (
        <View style={styles.rightIconsContainer}>
          <Ionicons
            onPress={() => navigation.navigate("Chats")}
            name="chatbox-outline"
            size={24}
            color="#f1f1f1"
          />
          <Ionicons
            onPress={() => navigation.navigate("Requests")}
            name="people-outline"
            size={24}
            color="#f1f1f1"
          />
        </View>
      ),
    });
  }, []);

  // function for decoding the token!
  // const decodeToken = async (token, secretKey) => {
  //   try {
  //     const decodedToken = await JWT.decode(token, secretKey);
  //     if (decodedToken && decodedToken.iat) {
  //       return decodedToken;
  //     } else {
  //       console.error("Invalid or missing Issued At claim in the token");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error decoding token:", error);
  //     return null;
  //   }
  // };

  console.log("users", users);

  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
      }}
    >
      <View style={{ padding: 5 }}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  rightIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto", // Move icons to the right
    gap: 20,
  },
  imageStyle: {
    marginLeft: -0.28 * width, // Adjust as needed
    // marginTop : 6  ,
    // alignSelf : 'center' ,
    width: 0.7 * width, // Adjust width as needed
    aspectRatio: 6, // Adjust the aspect ratio based on the image's original aspect ratio
    marginTop: 8,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
