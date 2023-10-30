import React, { useState, createRef } from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');


    const passwordInputRef = createRef();

    const handleSubmitPress = () => {
        setErrortext('');
        if (!id) {
            alert('아이디를 입력하세요.');
            return;
        }
        if (!password) {
            alert('비밀번호를 입력하세요.');
            return;
        }
        setLoading(true);
        let dataToSend = { id: id, password: password };
        let formBody = [];
        for (let key in dataToSend) {
            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        fetch('http://localhost:8080/subjects/add', {
            method: 'POST',
            body: formBody,
            headers: {
                'Content-Type':
                    'application/x-www-form-urlencoded;charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                setLoading(false);
                console.log(responseJson);
                if (responseJson.status === 'success') {
                    AsyncStorage.setItem('id', responseJson.data.id);
                    console.log(responseJson.data.id);
                    navigation.replace('Navigation');
                } else {
                    setErrortext(responseJson.msg);
                    console.log('Please check your id or password');
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    };

    return (
        <View style={Styles.container}>
            <TextInput
                label="아이디"
                style={Styles.input}
                onChangeText={(id) => setId(id)}
                onSubmitEditing={() =>
                    passwordInputRef.current &&
                    passwordInputRef.current.focus()
                }
                returnKeyType='next'
            />
            <TextInput
                label="비밀번호"
                style={Styles.input}
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType='next'
            />
            <Button icon="login" onPress={handleSubmitPress}>
                로그인
            </Button>
            <Text style={Styles.text} onPress={() => navigation.navigate('SignUpScreen')}>계정이 없으신가요?</Text>
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
    },
})