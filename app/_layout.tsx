import { Stack } from "expo-router";
import { StatusBar } from "react-native"
import Index from ".";
import Calendar from "./calendar";
//plus svg
                  //  <svg x="0px" y="0px" width="22" height="22" strokeWidth="1.8" viewBox="0 0 24 24"> 
                  //       <line x1="0" y1="12" x2="20" y2="12" stroke="black" strokeWidth="1.8"/>
                  //       <line x1="10" y1="2" x2="10" y2="22" stroke="black" strokeWidth="1.8"/>
                  //   </svg>

//calendar svg
                    // <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="-2 -2 18 18" fill="currentColor">

                    //     <rect x="0.5" y="0.5" width="14" height="14" rx="3.2" ry="3.2" fill="none"  stroke="black" strokeWidth="1.5"/>

                    //     <line x1="0" y1="4.2" x2="15" y2="4.2" stroke="black" strokeWidth="1.5"/>

                    //     <rect x="3.8" y="-0.7" width="1.5" height="2.5" rx="0.6" fill="black"/>
                    //     <rect x="10.2" y="-0.7" width="1.5" height="2.5" rx="0.6" fill="black"/>

                    //     <circle cx="4" cy="8" r="0.8" fill="black"/>
                    //     <circle cx="7.5" cy="8" r="0.8" fill="black"/>
                    //     <circle cx="11" cy="8" r="0.8" fill="black"/>
                    //     <circle cx="4" cy="10.5" r="0.8" fill="black"/>
                    //     <circle cx="7.5" cy="10.5" r="0.8" fill="black"/>
                    //     <circle cx="11" cy="10.5" r="0.8" fill="black"/>
                    // </svg>
//chevron svg
                    // <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    //     <polyline points="15 18 9 12 15 6" />
                    // </svg>
//TouchableOpacity
export default function RootLayout() {
  return(
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>
      <Stack>

      </Stack>
    </>
  );
}
