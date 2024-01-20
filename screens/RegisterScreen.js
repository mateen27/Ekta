import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Alert,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
// for Picking up the Images from the Gallery
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const RegisterScreen = () => {
  // state management
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // navigation
  const navigation = useNavigation();

  // function for picking images from the Gallery!
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // console.log();

      if (!result.cancelled) {
        setSelectedImage(result.assets[0].uri);
      } else {
        Alert.alert("You canceled the image selection.");
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  // function for uploading Image to The Cloudinary Service
  const uploadImageToCloudinary = async () => {
    if (selectedImage) {
      const data = new FormData();
      data.append("file", {
        uri: selectedImage,
        type: `image/${selectedImage.split(".").pop()}`,
        name: `test.${selectedImage.split(".").pop()}`,
      });
      data.append("upload_preset", "ShowStarter");

      try {
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
            console.log("Image uploaded to Cloudinary: ", cloudinaryData.secure_url);
            return cloudinaryData.secure_url;
          }
        }
        console.log("Image upload to Cloudinary failed");
      } catch (error) {
        console.error("Error uploading to Cloudinary: ", error);
      }
    } else {
      Alert.alert("Please select an image before uploading.");
    }
  };

    // function for handling User Registeration
    const handleRegister = async () => {
      if (selectedImage) {
        try {
          // Upload the image to Cloudinary and get the URL
          const cloudinaryUrl = await uploadImageToCloudinary();
          // console.log('IMAGE LINK is' , cloudinaryUrl);
  
          const user = {
            name: name,
            email: email,
            password: password,
            image: cloudinaryUrl,
          };
  
          // Send a POST request to the Backend API to register the user
          const response = await axios.post(
            "http://192.168.29.181:5000/user/register",
            user
          );
  
          if (response.status === 201 || response.status === 200) {
            console.log(response);
            Alert.alert("Registration successful", "You have been registered!");
            setName("");
            setEmail("");
            setPassword("");
            setSelectedImage(null);
  
            // navigating to the LoginScreen once the user is registered
            navigation.navigate("Login");
          } else {
            console.log(
              "Registration failed. Response status: ",
              response.status
            );
          }
        } catch (error) {
          Alert.alert(
            "Registration error",
            "An error occurred while registering"
          );
          console.error("Registration failed", error);
        }
      } else {
        Alert.alert("Please select an image before uploading.");
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

          <Text style={styles.textStyle}>Register</Text>

          <Text style={[styles.textStyle, { marginTop: 15, color: "#f3f1f1" }]}>
            Register To your Account
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.textField}>Name</Text>

            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={[styles.textInput, { fontSize: name ? 16 : 14 }]}
              placeholderTextColor={"gray"}
              placeholder="Enter your name"
            />
          </View>

          <View>
            <Text style={styles.textField}>Email</Text>

            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={[styles.textInput, { fontSize: email ? 16 : 14 }]}
              placeholderTextColor={"gray"}
              placeholder="Enter Your Email!"
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.textField}>Password</Text>

            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={[styles.textInput, { fontSize: password ? 16 : 14 }]}
              placeholderTextColor={"gray"}
              placeholder="Enter your password here!"
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.textField}>Image</Text>

            {/* <TextInput
              value={image}
              onChangeText={(text) => setImage(text)}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"black"}
              placeholder="Image"
            /> */}

            <Button title="Upload Image" color={"#333"} onPress={pickImage} />
          </View>

          <Pressable
            onPress={handleRegister}
            style={styles.registerButton}
          >
            <Text style={styles.buttonTextStyle}>Register</Text>
          </Pressable>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 15 }}
          >
            <Text style={styles.loginUser}>
              Already Have an account? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#000",
  },
  header: {
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    color: "#39B68D",
    fontSize: 17,
    fontWeight: "600",
  },
  textField: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f2f2f3",
  },
  textInput: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginVertical: 10,
    width: 300,
    color: "#f1f1f1",
  },
  registerButton: {
    width: 200,
    backgroundColor: "#39B68D",
    padding: 15,
    marginTop: 50,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 6,
  },
  loginUser: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    fontWeight: "600",
  },
  imageStyle: {
    marginLeft: "5%",
    width: "200%",
    // aspectRatio: 6, // Adjust the aspect ratio based on the image's original aspect ratio
  },
  buttonTextStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
