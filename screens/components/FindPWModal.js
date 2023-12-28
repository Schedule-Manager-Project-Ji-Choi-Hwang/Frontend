import React, { useState } from 'react';
import { View, Modal, Text, Alert, StyleSheet } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import axios from 'axios';
import Config from '../../config/config';

const FindPWModal = ({ isVisible, onClose }) => {
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');

    const handleFindPW = async () => {
        if (email.trim() === '' || !email.includes('@')) {
            Alert.alert('경고', '이메일을 정확히 입력하세요.');
            return;
        } else if (id.trim() === '') {
            Alert.alert('경고', '아이디를 입력하세요.');
            return;
        }
        let dataToSend = {
            loginId: id,
            email: email,
        }
        try {
            const response = await axios.post(`${Config.MY_IP}:8080/member/find-password`, dataToSend);
            alert(response.data);
            Alert.alert(response.data);
            handleClose();
        } catch (error)  {
            console.log("Find PW Error : ", error);
        };
    };

    const handleClose = () => {
        setId('');
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
                        icon="close"
                        onPress={handleClose}
                        style={Styles.closeButton}
                    />
                    <Text style={Styles.title}>비밀번호 찾기</Text>
                    <TextInput
                        placeholder="아이디"
                        style={Styles.input}
                        onChangeText={setId}
                        value={id}
                    />
                    <TextInput
                        placeholder="이메일"
                        style={Styles.input}
                        onChangeText={setEmail}
                        value={email}
                    />
                    <Button onPress={handleFindPW}>
                        비밀번호 찾기
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

export default FindPWModal;

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
