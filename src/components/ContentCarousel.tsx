import {useState} from 'react'
import { Text, View, TextInput, Button, StyleSheet} from "react-native";
import {Stack} from 'expo-router'
import PagerView from 'react-native-pager-view';

export default function ContentCarousel(){

    return(
        <PagerView style={styles.pagerView} initialPage={0}>
            <View key="1">
            <Text>First page</Text>
            </View>
            <View key="2">
            <Text>Second page</Text>
            </View>
            <View key="3">
            <Text>Third page</Text>
            </View>
            <View key="4">
            <Text>Forth page</Text>
            </View>
            <View key="5">
            <Text>Fifth page</Text>
            </View>
        </PagerView>

    )
}


const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  }
})
