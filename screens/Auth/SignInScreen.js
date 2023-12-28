import axios from 'axios';
import React, { useState, createRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { View, Text, StyleSheet, Keyboard, Modal, Alert } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from "../../config/config";
import SignUpScreen from './SignUpScreen';
import FindIDModal from '../components/FindIDModal';
import FindPWModal from '../components/FindPWModal';

const SignInScreen = ({ isVisible, onClose }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [errortext, setErrortext] = useState('');
    const [isSignUpVisible, setIsSignUpVisible] = useState(false);
    const [isFindIDVisible, setIsFindIDVisible] = useState(false);
    const [isFindPWVisible, setIsFindPWVisible] = useState(false);


    const { setIsLoggedIn } = useAuth();
    const passwordInputRef = createRef();

    const onLoginSuccess = () => {
        setIsLoggedIn(true);
        onClose();
    };

    const handleSubmitPress = async () => {
        setErrortext('');
        if (id.trim() === '') {
            Alert.alert('경고', '아이디를 입력하세요.');
            return;
        }
        if (password.trim() === '') {
            Alert.alert('경고', '비밀번호를 입력하세요.');
            return;
        }
        let dataToSend = {
            loginId: id,
            password: password
        };
        try {
            const response = await axios.post(`${Config.MY_IP}:8080/member/log-in`, dataToSend);
            if (response.status === 204) {
                AsyncStorage.setItem('AccessToken', response.headers['authorization']);
                AsyncStorage.setItem('RefreshToken', response.headers['refresh-token']);
                onLoginSuccess();
            }
        } catch (error) {
            console.error("Login Error", error);
        }
    };

    const handleShowSignUp = () => setIsSignUpVisible(true);
    const handleCloseSignUp = () => setIsSignUpVisible(false);

    const handleShowFindID = () => setIsFindIDVisible(true);
    const handleCloseFindID = () => setIsFindIDVisible(false);

    const handleShowFindPW = () => setIsFindPWVisible(true);
    const handleCloseFindPW = () => setIsFindPWVisible(false);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={Styles.centeredView}>
                <View style={Styles.container}>
                    <IconButton
                        icon="close"
                        iconColor="grey"
                        size={25}
                        onPress={onClose}
                        style={Styles.closeButton}
                    />
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
                    <View style={Styles.findContainer}>
                        <Text style={Styles.findText} onPress={handleShowFindID}>
                            아이디 찾기
                        </Text>
                        <Text style={Styles.findText} onPress={handleShowFindPW}>
                            비밀번호 찾기
                        </Text>
                    </View>
                    <Text style={Styles.text} onPress={handleShowSignUp}>
                        계정이 없으신가요?
                    </Text>
                    <SignUpScreen
                        isVisible={isSignUpVisible}
                        onClose={handleCloseSignUp}
                    />
                    <FindIDModal
                        isVisible={isFindIDVisible}
                        onClose={handleCloseFindID}
                    />
                    <FindPWModal
                        isVisible={isFindPWVisible}
                        onClose={handleCloseFindPW}
                    />
                </View>
            </View>
        </Modal>
    );
}

export default SignInScreen;


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
    input: {
        width: '70%',
        marginBottom: '10%',
    },
    findContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '70%',
        marginTop: 5,
        marginBottom: 15,
    },
    findText: {
        color: 'black',
    },

})