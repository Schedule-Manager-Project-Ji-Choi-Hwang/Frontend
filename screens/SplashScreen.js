import React from "react";
import { View, Image } from "react-native";

export default function SplashScreen() {
    return (
        <View>
            <Image source={require('../assets/splash.png')}/>
        </View>
    );
}