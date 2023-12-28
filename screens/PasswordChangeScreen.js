import React, { useState } from 'react';
import { View, StyleSheet, Modal, Alert, TextInput } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config/config';

const PasswordChangeScreen = ({ isVisible, onClose }) => {
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = async () => {
        let dataToSend = {
            password: newPassword
        }
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            if (!token) {
                console.log('No access token');
                return;
            }
            await axios.patch(`${Config.MY_IP}:8080/member/edit`, dataToSend, {
                headers: { Authorization: token }
            });
            alert("비밀번호가 변경되었습니다.");
            Alert.alert("비밀번호가 변경되었습니다.");
            onClose();
        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <IconButton
                        icon="close"
                        iconColor="grey"
                        size={25}
                        onPress={onClose}
                        style={styles.closeButton}
                    />
                    <TextInput
                        placeholder="신규 비밀번호"
                        secureTextEntry
                        style={styles.input}
                        onChangeText={setNewPassword}
                        value={newPassword}
                    />
                    <Button onPress={handleSubmit}>비밀번호 변경</Button>
                </View>
            </View>
        </Modal>
    );
};
export default PasswordChangeScreen;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        position: 'absolute',
        right: 10,
        top: 10,
    },
    input: {
        width: '70%',
        marginBottom: '10%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
});


