import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MyPage() {
    return (
        <View style={Styles.container}></View>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'yellow',
    }
})