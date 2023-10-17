import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StudyPage() {
    return (
        <View style={Styles.container}>
            <Text style={Styles.Text}>스터디 페이지</Text>
        </View>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'blue',
    },

})