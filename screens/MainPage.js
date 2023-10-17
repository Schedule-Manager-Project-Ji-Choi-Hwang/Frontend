import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MainPage() {
    return (
        <View style={Styles.container}>
            <Text style={Styles.Text}>메인 페이지</Text>
        </View>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
    },

})