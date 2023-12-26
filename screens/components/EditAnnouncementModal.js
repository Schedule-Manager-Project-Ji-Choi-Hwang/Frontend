import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import { Modal, Portal, Text, Button, TextInput, } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Config from "../../config/config";

const EditAnnouncementModal = ({ visible, onDismiss, studyPostId, announcement, updateAnnouncement }) => {
    const [announcementId, setAnnouncementId] = useState('');
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementContent, setAnnouncementContent] = useState('');

    useEffect(() => {
        if (visible) {
            const fetchData = async () => {
                try {
                    await fetchAnnouncementData();
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }
    }, [visible]);

    const fetchAnnouncementData = async () => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            const response = await axios.get(`${Config.MY_IP}:8080/study-board/${studyPostId}/study-announcements/${announcement.announcementId}`, {
                headers: { Authorization: token }
            });

            if (response.status === 200) {

                setAnnouncementId(response.data.data.announcementId);
                setAnnouncementTitle(response.data.data.announcementTitle);
                setAnnouncementContent(response.data.data.announcementPost);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditAnnouncement = async () => {
        // 여기에서 서버에 데이터를 제출하는 로직을 구현
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            await axios.patch(`${Config.MY_IP}:8080/study-board/${studyPostId}/study-announcements/${announcementId}/edit`,
                { announcementPost: announcementContent, announcementTitle: announcementTitle},
                { headers: { Authorization: token } }
            );
            onDismiss();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = async () => {
        await handleEditAnnouncement();
        await updateAnnouncement();
    }

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>공지사항 수정</Text>
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
                    <Button mode="contained" onPress={handleEdit} style={styles.button}>
                        수정
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

export default EditAnnouncementModal;