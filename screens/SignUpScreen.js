import React, { useState, createRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default function SignUpScreen(props) {

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');
    const [
        isRegistraionSuccess,
        setIsRegistraionSuccess
    ] = useState(false);

    const idInputRef = createRef();
    const passwordInputRef = createRef();
    const nameInputRef = createRef();
    const emailInputRef = createRef();

    const handleSubmitButton = () => {
        setErrortext('');
        if (!id) {
            alert('아이디를 입력하세요.');
            return;
        }
        if (!password) {
            alert('비밀번호을 입력하세요.');
            return;
        }
        if (!userName) {
            alert('이름을 입력하세요.');
            return;
        }
        if (!userEmail) {
            alert('이메일을 입력하세요.');
            return;
        }

        setLoading(true);
        var dataToSend = {
            id: id,
            password: password,
            name: userName,
            email: userEmail,
        };
        var formBody = [];
        for (var key in dataToSend) {
            var encodedKey = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        fetch('http://localhost:8080/api/user/register', {
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
                    setIsRegistraionSuccess(true);
                    console.log(
                        'Registration Successful. Please Login to proceed'
                    );
                } else {
                    setErrortext(responseJson.msg);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    };
    if (isRegistraionSuccess) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#307ecc',
                    justifyContent: 'center',
                }}>
                <Image
                    source={require('../assets/favicon.png')}
                    style={{
                        height: 150,
                        resizeMode: 'contain',
                        alignSelf: 'center'
                    }}
                />
                <Text>
                    회원가입 성공
                </Text>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => props.navigation.navigate('SignInScreen')}>
                    <Text>로그인</Text>
                </TouchableOpacity>
            </View>
        );
    }
    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>회원가입</Text>
            <TextInput
                label="아이디"
                style={Styles.input}
                onChangeText={(id) => setId(id)}
                ref={idInputRef}
                returnKeyType="next"
                onSubmitEditing={() =>
                    idInputRef.current && idInputRef.current.focus()
                }
                blurOnSubmit={false}
            />
            <TextInput
                label="비밀번호"
                style={Styles.input}
                onChangeText={(password) => setPassword(password)}
                ref={passwordInputRef}
                returnKeyType="next"
                blurOnSubmit={false}
            />
            {/* <TextInput
                label="비밀번호 확인"
                style={Styles.input}
                onChangeText={(id) => setId(id)}
                onSubmitEditing={() =>
                    idInputRef.current && idInputRef.current.focus()
                }
                blurOnSubmit={false}
            /> */}
            <TextInput
                label="이름"
                style={Styles.input}
                onChangeText={(userName) => setUserName(userName)}
                ref={nameInputRef}
                returnKeyType="next"
                onSubmitEditing={() =>
                    nameInputRef.current && nameInputRef.current.focus()
                }
                blurOnSubmit={false}
            />
            <TextInput
                label="이메일"
                style={Styles.input}
                onChangeText={(userEmail) => setUserEmail(userEmail)}
                ref={emailInputRef}
                returnKeyType="next"
                onSubmitEditing={() =>
                    emailInputRef.current && emailInputRef.current.focus()
                }
                blurOnSubmit={false}
            />
            <Button onPress={handleSubmitButton}>
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
    successTextStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        padding: 30,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    }
})