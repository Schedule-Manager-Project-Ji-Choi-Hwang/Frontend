import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Login({navigation}) {
    return (
        <TouchableOpacity style={Styles.NextButton} onPress={() => navigation.navigate('Navigation')}>
            <Text style={Styles.TextButton}>다음 화면으로</Text>
        </TouchableOpacity >
    );
}

const Styles = StyleSheet.create({
    NextButton: {
        backgroundColor: "black",
        padding: 10,
        marginTop: "20%",
        width: "50%",
        alignSelf: "center",
        borderRadius: 10,
    },
    TextButton: {
        color: "white",
        textAlign: "center"
    }
})