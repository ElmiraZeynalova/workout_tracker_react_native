import {useDateStore} from "../store/date-store"
import { Text, View, Pressable, StyleSheet} from "react-native";
import { SvgXml } from "react-native-svg"

const leftArrowIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" transform="scale(-1,1)">
        <path d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z" fill="#ffffff"/>
    </svg>
`;

const rightArrowIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z" fill="#ffffff"/>
    </svg>
`;

export default function DateBar(){
    const selectedDate = useDateStore((state) => state.selectedDate)
    const goPrev= useDateStore((state) => state.goPrevDay)
    const goNext= useDateStore((state) => state.goNextDay)
    return(
        <View>
            <Pressable onPress={goPrev}>
                <SvgXml xml={leftArrowIcon} width={28} height={28}/>
            </Pressable>
            <Text>{selectedDate}</Text>
            <Pressable onPress={goNext}>
                <SvgXml xml={rightArrowIcon} width={28} height={28}/>
            </Pressable>
        </View>
    );
}