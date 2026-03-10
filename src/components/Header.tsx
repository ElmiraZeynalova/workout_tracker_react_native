import { Text, View, Pressable, TextInput, Button, StyleSheet} from "react-native";
import { Link } from "expo-router"
import { SvgXml } from "react-native-svg"

const plusIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M11 2 L11 11 L2 11 L2 13 L11 13 L11 22 L13 22 L13 13 L22 13 L22 11 L13 11 L13 2 Z" />
    </svg>
`

const calendarIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <rect x="3" y="5" width="18" height="16" fill="white" stroke="black" stroke-width="1" rx="2" ry="2"/>
  <line x1="3" y1="9" x2="21" y2="9" stroke="black" stroke-width="1"/>
  <line x1="7" y1="3" x2="7" y2="5" stroke="black" stroke-width="1"/>
  <line x1="17" y1="3" x2="17" y2="5" stroke="black" stroke-width="1"/>
  <line x1="6" y1="13" x2="18" y2="13" stroke="black" stroke-width="1"/>
  <line x1="6" y1="17" x2="18" y2="17" stroke="black" stroke-width="1"/>
  <line x1="6" y1="13" x2="6" y2="21" stroke="black" stroke-width="1"/>
  <line x1="10" y1="13" x2="10" y2="21" stroke="black" stroke-width="1"/>
  <line x1="14" y1="13" x2="14" y2="21" stroke="black" stroke-width="1"/>
  <line x1="18" y1="13" x2="18" y2="21" stroke="black" stroke-width="1"/>
</svg>
`
export default function Header(){
    return(
        <View>
            <Text>Home</Text>
            <View>
                <Link href="/log-workout">
                    <Pressable>
                        <SvgXml xml={plusIcon} width={24} height={24}/>
                    </Pressable>
                </Link>
                <Link href="/calendar">
                    <Pressable>
                        <SvgXml xml={calendarIcon} width={24} height={24}/>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}