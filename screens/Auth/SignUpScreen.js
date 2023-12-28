import axios from 'axios';
import React, { useState, createRef } from 'react';
import {
    View,
    Modal,
    Text,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import Config from "../../config/config";

const SignUpScreen = ({ isVisible, onClose }) => {

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [errortext, setErrortext] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

    const idInputRef = createRef();
    const passwordInputRef = createRef();
    const nameInputRef = createRef();
    const emailInputRef = createRef();

    const handleRegistrationSuccess = () => {
        alert('회원가입 성공');
        setIsRegistraionSuccess(true);
        onClose();
    };

    const handleSubmitButton = async () => {
        setErrortext('');
        if (id.trim() === '') {
            Alert.alert('경고', '아이디를 입력하세요.');
            return;
        }
        if (password.trim() === '') {
            Alert.alert('경고', '비밀번호을 입력하세요.');
            return;
        }
        if (userName.trim() === '') {
            Alert.alert('경고', '이름을 입력하세요.');
            return;
        }
        if (userEmail.trim() === '' || !userEmail.includes('@')) {
            Alert.alert('경고', '이메일을 정확히 입력하세요.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('경고', '비밀번호가 일치하지 않습니다.');
            return;
        }
        let dataToSend = {
            loginId: id,
            password: password,
            nickname: userName,
            email: userEmail,
        };

        await axios.post(`${Config.MY_IP}:8080/member/sign-up`, dataToSend)
            .then((response) => {
                if (response.status == 200) {
                    // handleRegistrationSuccess();
                    alert('회원가입 성공');
                    onClose();
                } else {
                    alert('회원가입 실패');
                    setErrortext(response.data.msg);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={Styles.centeredView}>
                    <View style={Styles.container}>
                        <IconButton
                            icon="close"
                            iconColor="grey"
                            size={25}
                            onPress={onClose}
                            style={Styles.closeButton}
                        />
                        <Text style={Styles.title}>회원가입</Text>
                        <TextInput
                            label="닉네임"
                            style={Styles.input}
                            onChangeText={(userName) => setUserName(userName)}
                            ref={nameInputRef}
                            onSubmitEditing={() =>
                                nameInputRef.current && nameInputRef.current.focus()
                            }
                            blurOnSubmit={false}
                        />
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
                            secureTextEntry={true}
                            ref={passwordInputRef}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            label="비밀번호 확인"
                            style={Styles.input}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={true}
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
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default SignUpScreen;

const Styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    title: {
        width: '70%',
        textAlign: 'center',
        marginBottom: '15%',
        // fontSize: '30px'
    },
    input: {
        width: '70%',
        marginBottom: '10%',
    }
})