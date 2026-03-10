import {useState} from 'react'
import { Text, View, TextInput, Button, StyleSheet} from "react-native";
import {Stack} from 'expo-router'
import PagerView from 'react-native-pager-view';
import Header from '../src/components/Header';
import DateBar from '../src/components/DateBar';
import ContentCrousel from '../src/components/ContentCarousel';

export default function Home() {
  return(
    <View>
      <Header/>
      <DateBar/>
      <ContentCrousel/>
    </View>
  )


}

