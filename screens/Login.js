import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default function Login({ navigation }) {
    return (
        <View style={Styles.container}>
            <TextInput
                label="아이디"
                style={Styles.input}
            />
            <TextInput
                label="비밀번호"
                style={Styles.input}
            />
            <Button icon="login" onPress={() => navigation.navigate('index')}>
                로그인
            </Button>
        </View>
    );
}



const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '70%',
        marginBottom: '10%',
    }
})