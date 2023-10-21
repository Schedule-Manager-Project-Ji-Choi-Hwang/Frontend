import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default function SignUpScreen({ navigation }) {
    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>회원가입</Text>
            <TextInput
                label="아이디"
                style={Styles.input}
            />
            <TextInput
                label="비밀번호"
                style={Styles.input}
            />
            <TextInput
                label="비밀번호 확인"
                style={Styles.input}
            />
            <TextInput
                label="이름"
                style={Styles.input}
            />
            <TextInput
                label="이메일"
                style={Styles.input}
            />
            <Button onPress={() => navigation.popToTop()}>
                회원가입
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
    title: {
        width: '70%',
        textAlign: 'center',
        marginBottom: '15%',
        fontSize: '30px'
    },
    input: {
        width: '70%',
        marginBottom: '10%',
    },
})