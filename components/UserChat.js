import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
// icon
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const UserChat = ({item}) => {

    // navigation
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight : () => (
                <TouchableOpacity style={styles.rightIconsContainer}>
                    <AntDesign name="addusergroup" size={22} color="#D5D5D5" />
                    <Text style = {{ color : '#D5D5D5' }}>New Group</Text>
                </TouchableOpacity>
            )
        })
    } , [])

  return (
    <TouchableOpacity style = { styles.container } onPress={() => navigation.navigate('Message' , {
        recepientId : item._id
    })}>
      <Image
        source={{ uri : item?.image }}
        style = { styles.imageStyle }
      />

      {/* View for the name */}
      <View style = {{ flex : 1 }}>
        <Text style = { styles.textStyle }>{item?.name}</Text>
        <Text style = { [styles.textStyle , { color : 'gray' , fontWeight : '600' , fontSize : 12 , marginTop : 4}] }>tap to see the message!</Text>
      </View>

      {/* VIew for the timing of the Message! */}
      <View>
        <Text style = {styles.timeTextStyle}>3:00 p.m.</Text>
      </View>
    </TouchableOpacity>
  )
}

export default UserChat

const styles = StyleSheet.create({
    container : {
        // flex : 1 , 
        // backgroundColor : 'black'
        padding : 10 , 
        marginHorizontal : 10 , 
        flexDirection : 'row' , 
        alignItems : 'center' , 
        gap : 10 , 
        borderWidth : 0.7, 
        borderTopWidth : 0 , 
        borderLeftWidth : 0 , 
        borderRightWidth : 0 , 
        borderColor : '#D0D0D0'
        // marginVertical : 5
    } , 
    textStyle : {
        color : '#f1f1f1' , 
        fontWeight : '900' , 
        fontSize : 14
    } , 
    imageStyle : {
        width: 60,
        height: 60,
        borderRadius: 25,
        resizeMode: "cover",
    } , 
    timeTextStyle : {
        color : '#585858' , 
        fontWeight : '400' , 
        fontSize : 12
    } , 
    rightIconsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "auto", // Move icons to the right
        gap: 5,
        backgroundColor : '#222' , 
        padding : 5 , 
        borderRadius : 5 , 
        elevation : 10
      },
})