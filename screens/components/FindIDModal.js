import React, { useState } from 'react';
import { View, Modal, Text, Alert, StyleSheet } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import axios from 'axios';
import Config from '../../config/config';

const FindIDModal = ({ isVisible, onClose }) => {
    const [email, setEmail] = useState('');

    const handleFindID = async () => {
        if (email.trim() === '' || !email.includes('@')) {
            alert('이메일을 정확히 입력하세요.');
            Alert.alert('이메일을 정확히 입력하세요.');
            return;
        }
        let dataToSend = {
            email: email,
        }
        try {
            const response = await axios.post(`${Config.MY_IP}:8080/member/find-loginid`, dataToSend);
            console.log(response.data.loginId);
            alert('아이디 찾기 성공 : '+ response.data.loginId);
            Alert.alert('아이디 찾기 성공 : '+ response.data.loginId);
        } catch (error)  {
            console.log("Find ID Error : ", error);
        };
    };

    const handleClose = () => {
        setEmail('');
        onClose();
    };

    return (
        <Modal
            visible={isVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={Styles.centeredView}>
                <View style={Styles.modalView}>
                    <IconButton
                        style={Styles.closeButton}
                        icon="close"
                        onPress={handleClose}
                    />
                    <Text style={Styles.title}>아이디 찾기</Text>
                    <TextInput
                        placeholder="이메일"
                        style={Styles.input}
                        onChangeText={setEmail}
                        value={email}
                    />
                    <Button onPress={handleFindID}>
                        아이디 찾기
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

export default FindIDModal;

const Styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    title: {
        fontSize: 20,
        marginBottom: 15,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
});