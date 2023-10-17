import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MyPage() {
    return (
        <View style={Styles.container}>
            <Text style={Styles.HomeText}>마이페이지 화면</Text>
        </View>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'yellow',
    }
})