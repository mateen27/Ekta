import { StyleSheet, Text, View , ScrollView, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../context/userContext";
import { useNavigation } from "@react-navigation/native";
import UserChat from "../components/UserChat";

const ChatsScreen = () => {
  // state management
  const [acceptedFriends, setAcceptedFriends] = useState([]);

  // for accesing the user ID
  const { userId, setUserId } = useContext(UserType);

  // navigation
  const navigation = useNavigation();

  // useEffect
  useEffect(() => {
    const acceptedFriendsList = async () => {
      try {
        const response = await fetch(
          `http://192.168.29.181:5000/user/friends/${userId}`
        );

        const data = await response.json();

        if (response.ok) {
          setAcceptedFriends(data);
        }
      } catch (error) {
        console.log("error fetching the accepted friends list: ", error);
      }
    };

    acceptedFriendsList();
  }, []);

  console.log("accepted friends " , acceptedFriends);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style = { styles.container }>
      <TouchableOpacity>
        {
            acceptedFriends.map((item , index) => (
                <UserChat key={index} item={item}/>
            ))
        }
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
    container : {
        flex : 1 , 
        backgroundColor : 'black'
    }
});
