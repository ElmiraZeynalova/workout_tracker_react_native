import {useState} from 'react'
import { Text, View, TextInput, Button, StyleSheet} from "react-native";
import MainSwiper from "../src/components/MainSwiper"
import DateBar from "../src/components/DateBar"

export default function Index() {
  return(
    <View style={styles.view}>
      <DateBar/>
      <MainSwiper/>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  }
})