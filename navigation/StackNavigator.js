import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ChatsScreen from '../screens/ChatsScreen';
import ChatMessageScreen from '../screens/ChatMessageScreen';

const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown : true }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown : false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown : false }} />
        <Stack.Screen name="Requests" component={FriendsScreen} options={{ headerShown : true , headerTintColor : '#fff' , headerStyle : { backgroundColor : '#131313' }}}  />
        <Stack.Screen name="Chats" component={ChatsScreen} options={{ headerShown : true , headerTintColor : '#fff' , headerStyle : { backgroundColor : '#131313' }}}  />
        <Stack.Screen name="Message" component={ChatMessageScreen} options={{ headerShown : true , headerTintColor : '#fff' , headerStyle : { backgroundColor : '#131313' }}}  />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})