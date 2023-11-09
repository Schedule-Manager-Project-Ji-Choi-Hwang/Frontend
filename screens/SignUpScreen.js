import axios from 'axios';
import React, { useState, createRef } from 'react';
import {
    View,
    Text,
    Image,
    Keyboard,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';
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
            loginId: id,
            password: password,
            nickname: userName,
            email: userEmail,
        };

        axios.post('http://localhost:8080/member/sign-up', dataToSend)
            .then((response) => {
                setLoading(false);
                console.log(response.data);
                // 서버로부터 받은 응답을 처리합니다.
                if (response.data === '회원가입 성공') {
                    setIsRegistraionSuccess(true);
                    console.log('Registration Successful. Please Login to proceed');
                } else {
                    setErrortext(response.data.msg);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    };
    if (isRegistraionSuccess) {
        return (
            <View style={Styles.successView}>
                <Image
                    source={require('../assets/favicon.png')}
                    style={Styles.successImage}
                />
                <Text style={Styles.successText}>
                    회원가입 성공
                </Text>
                <Button
                    style={Styles.successButton}
                    activeOpacity={0.5}
                    onPress={() => props.navigation.navigate('SignInScreen')}>
                    <Text>로그인</Text>
                </Button>
            </View>
        );
    }
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={Styles.container}>
                <Text style={Styles.title}>회원가입</Text>
                <TextInput
                    label="아이디"
                    style={Styles.input}
                    onChangeText={(id) => setId(id)}
                    ref={idInputRef}
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
                    onSubmitEditing={() =>
                        emailInputRef.current && emailInputRef.current.focus()
                    }
                    blurOnSubmit={false}
                />
                <Button onPress={handleSubmitButton}>
                    회원가입
                </Button>
            </View>
        </TouchableWithoutFeedback>
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
    },
    successView: {
        flex: 1,
        backgroundColor: '#307ecc',
        justifyContent: 'center'
    },
    successImage: {
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    successText: {
        marginBottom: '80%',
        textAlign: 'center',
        color: 'white'
    },
    successButton: {
        alignItems: 'center',
        marginBottom: '50%'
    }
})