import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  // state manangement
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // navigation
  const navigation = useNavigation();

  // function for checking the login status!
  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       // accessing the token from async storage!
  //       const token = await AsyncStorage.getItem("authToken");

  //       // if token found
  //       if (token) {
  //         navigation.replace("Home");
  //       } else {
  //         // token not found navigate to the Login Screen itself!
  //       }
  //     } catch (error) {
  //       console.log("error checking the login status", error);
  //     }
  //   };

  //   // calling the function
  //   checkLoginStatus();
  // }, []);

  // function for handling the login!
  const handleLogin = async () => {
    try {
      const user = {
        email: email,
        password: password,
      };

      // hitting the backend API
      const response = await axios.post(
        "http://192.168.29.181:5000/user/login",
        user
      );

      console.log(response);

      if (response.status === 201 || response.status === 200) {
        // accessing the token
        const token = response.data.token;

        // storing the token in async Storage!
        AsyncStorage.setItem("authToken", token);

        // navigating to the Home Screen!
        navigation.replace("Home");
      } else {
        Alert.alert("Login Error", "Invalid email or password!");
        console.log(response.status);
      }
    } catch (error) {
      // Handle errors from the request or AsyncStorage
      console.error("Login error:", error);
      Alert.alert("Login Error", "An error occurred during login.");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <View style={styles.header}>
          <Image
            source={require("../images/loogo.png")}
            style={styles.imageStyle}
            resizeMode="contain"
          />

          <Text style={styles.textStyle}>Sign In</Text>

          <Text
            style={[
              styles.textStyle,
              { color: "#f3f1f1", marginTop: 15, fontSize: 16 },
            ]}
          >
            Sign In to your Account
          </Text>
        </View>

        {/* View for the form */}
        <View style={styles.formStyle}>
          {/* View holding email and textInput for email */}
          <View>
            <Text style={styles.textField}>Email</Text>

            <TextInput
              value={email}
              onChangeText={(email) => setEmail(email)}
              placeholder="Enter your Email id"
              placeholderTextColor={"gray"}
              style={[styles.textInputStyle, { fontSize: email ? 16 : 14 }]}
            />
          </View>

          {/* View holding password and textInput for password */}
          <View style={{ marginTop: 30 }}>
            <Text style={styles.textField}>Password</Text>

            <TextInput
              value={password}
              onChangeText={(password) => setPassword(password)}
              placeholder="Enter your Password"
              placeholderTextColor={"gray"}
              secureTextEntry
              style={[styles.textInputStyle, { fontSize: password ? 16 : 14 }]}
            />
          </View>

          {/* Button for Login */}
          <Pressable style={styles.buttonStyle} onPress={handleLogin}>
            <Text style={styles.buttonTextStyle}>Login</Text>
          </Pressable>

          {/* TouchableOpacity for Registering the user */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={styles.registerContainer}
          >
            <Text style={styles.registerUserStyle}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
    alignItems: "center",
  },
  header: {
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    marginTop: 30,
    color: "#39B68D",
    fontSize: 19,
    fontWeight: "600",
  },
  imageStyle: {
    marginLeft: "3%",
    width: "80%",
    aspectRatio: 6, // Adjust the aspect ratio based on the image's original aspect ratio
  },
  formStyle: {
    marginTop: 40,
    // backgroundColor: '#333', // Set a background color for the form container
    marginLeft: "35%",
    padding: 10,
  },
  textField: {
    color: "#f2f2f3",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10, // Add margin-bottom to separate text from TextInput
  },
  textInputStyle: {
    borderBottomColor: "#333",
    borderBottomWidth: 1,
    marginVertical: -5,
    width: 300,
    padding: 2,
    color: "white",
  },
  buttonStyle: {
    width: 200,
    backgroundColor: "#39B68D",
    padding: 15,
    marginTop: 60,
    borderRadius: 6,
    marginLeft: "14%",
  },
  buttonTextStyle: {
    fontSize: 16,
    color: "white",
    fontWeight: "700",
    textAlign: "center",
  },
  registerContainer: {
    marginTop: 15,
    // alignItems : 'center'
  },
  registerUserStyle: {
    color: "gray",
    fontSize: 15,
    fontWeight: "600",
    // textAlign : 'center'
    marginLeft: "10%",
  },
});
