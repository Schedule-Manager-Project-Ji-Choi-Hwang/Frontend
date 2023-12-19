import React, { useState } from 'react';
import {View, StyleSheet} from 'react-native';
import { Modal, Portal, Text, Button, TextInput, } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Config from "../../config/config";

const AddAnnouncementModal = ({ visible, onDismiss, updateAnnouncement, studyData }) => {
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementContent, setAnnouncementContent] = useState('');

    const handleAddAnnouncement = async () => {
        // 여기에서 서버에 데이터를 제출하는 로직을 구현
        try {
            // 만약 공지 제목이나 내용이 비어있으면 여기에서 검사하고 등록 못하게 막기
            //
            //
            console.log(`studyData.studyPostId : ${studyData.id}`)
            console.log(`title : ${announcementTitle}`)
            console.log(`post : ${announcementContent}`)

            const token = await AsyncStorage.getItem('AccessToken');
            await axios.post(`${Config.MY_IP}:8080/study-board/${studyData.id}/study-announcements/add`,
                { announcementTitle: announcementTitle,
                    announcementPost : announcementContent},
                { headers: { Authorization: token } }
            );
            onDismiss(); // 모달 닫기
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        await handleAddAnnouncement();
        await updateAnnouncement();
    }

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>공지사항 등록</Text>
                    <TextInput
                        label="공지사항 제목"
                        value={announcementTitle}
                        onChangeText={text => setAnnouncementTitle(text)}
                        style={styles.input}
                    />
                    <TextInput
                        label="공지사항 내용"
                        value={announcementContent}
                        onChangeText={text => setAnnouncementContent(text)}
                        multiline
                        numberOfLines={4}
                        style={styles.input}
                    />
                    <Button mode="contained" onPress={handleSave} style={styles.button}>
                        등록
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 15,
        backgroundColor: 'white', // TextInput의 기본 배경색 변경
    },
    button: {
        marginTop: 10,
    },
});

export default AddAnnouncementModal;