import React, { useState, useEffect } from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { Text, Modal, Portal, Card, IconButton, Menu } from 'react-native-paper';
import axios from 'axios';
import Config from '../../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnnouncementDetailModal from "./AnnouncementDetailModal";

const StudyModal = ({ visible, hideModal, studyData }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [members, setMembers] = useState([]);
    const [menuVisible, setMenuVisible] = useState({});

    const [announcementModalVisible, setAnnouncementModalVisible] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);


    useEffect(() => {
        if (visible) {
            const fetchData = async () => {
                try {
                    await fetchAnnouncementsAndStudyMembers();
                } catch (error) {
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [visible]);

    const openAnnouncementModal = (announcement) => {
        setSelectedAnnouncement(announcement);
        setAnnouncementModalVisible(true);
    };

    const closeAnnouncementModal = () => {
        setAnnouncementModalVisible(false);
    };


    const toggleMenuVisibility = (index) => {
        setMenuVisible(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const fetchAnnouncementsAndStudyMembers = async () => {
        // 서버 요청으로 공지 목록을 가져오는 로직
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            const response = await axios.get(`${Config.MY_IP}:8080/study-board/${studyData.studyPostId}/detail`, {
                headers: { Authorization: token }});
            console.log(response.data.data.announcementList);
            console.log(response.data.data.studyMemberList);
            console.log(response.status);

            if (response.status === 200) {
                // 정상적인 응답을 받았을 때
                setAnnouncements(response.data.data.announcementList);
                setMembers(response.data.data.studyMemberList);
            } else if (response.status === 400) {
                // 서버가 400 상태 코드를 반환했을 때
                setAnnouncements([]);
                setMembers([]);
            }
        } catch (error) {
            console.error(error);
            setAnnouncements([]);
            setMembers([]);
        }
    };

    const handleKickOut = async (member) => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            await axios.delete(`${Config.MY_IP}:8080/study-board/${studyData.studyPostId}/study-member/${member.studyMemberId}/expulsion`,
                { headers: { Authorization: token }
            });
            await updateAnnouncement();
            // 상태 업데이트나 확인 메시지 표시
        } catch (error) {
            console.error(error);
            // 에러 처리
        }
    };

    const updateAnnouncement = async () => {
        await fetchAnnouncementsAndStudyMembers();
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                <ScrollView>
                    <View style={styles.header}>
                        <IconButton
                            icon="arrow-left"
                            size={24}
                            onPress={hideModal}
                        />
                        <View style={{ flex: 3, justifyContent: 'center' }}>
                            <Text style={styles.headerTitle}>{studyData.studyName}</Text>
                        </View>
                        <View style={{ flex: 1 }}></View>
                    </View>
                    <View style={styles.modalView}>
                        <Text style={styles.sectionTitle}>공지사항</Text>
                        <View style={styles.separator} />
                        {/* 공지 목록을 카드 형태로 표시 */}
                        {announcements.map((announcement, index) => (
                            <TouchableOpacity key={index} onPress={() => openAnnouncementModal(announcement)}>
                                <Card style={styles.card}>
                                    <Card.Title title={announcement.announcementTitle} />
                                    <Card.Content>
                                        <Text>{announcement.createDate}</Text>
                                    </Card.Content>
                                </Card>
                            </TouchableOpacity>
                        ))}
                        <Text style={styles.sectionTitle}>스터디 인원</Text>
                        <View style={styles.separator} />
                        {/* 스터디 멤버를 카드 형태로 표시 */}
                        {members.map((member, index) => (
                            <Card key={index} style={styles.card}>
                                <Card.Title
                                    title={member.nickname}
                                    right={(props) =>
                                        member.authority === 'MEMBER' && (
                                            <Menu
                                                visible={menuVisible[index]}
                                                onDismiss={() => toggleMenuVisibility(index)}
                                                anchor={
                                                    <IconButton
                                                        {...props}
                                                        icon="dots-vertical"
                                                        onPress={() => toggleMenuVisibility(index)}
                                                    />
                                                }
                                            >
                                                <Menu.Item onPress={() => handleKickOut(member)} title="강퇴" />
                                            </Menu>
                                        )
                                    }
                                />
                                <Card.Content>
                                    <Text>{member.authority}</Text>
                                </Card.Content>
                            </Card>
                        ))}
                    </View>
                </ScrollView>
            </Modal>
            {/* 새로운 AnnouncementModal 컴포넌트 추가 */}
            <AnnouncementDetailModal
                visible={announcementModalVisible}
                onDismiss={closeAnnouncementModal}
                announcement={selectedAnnouncement}
                studyPostId = {studyData.studyPostId}
            />
        </Portal>
    );
};

export default StudyModal;

const styles = StyleSheet.create({
    separator: {
        borderBottomColor: '#e0e0e0', // 선의 색상
        borderBottomWidth: 1, // 선의 두께
        marginVertical: 8, // 위아래 여백
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 10,
    },
    header: {
        flexDirection: 'row',
        height: 45,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 20,
        textAlign: 'center'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    modalView: {
        padding: 20,
    },
    card: {
        marginBottom: 10,
    },
    // ... 나머지 스타일 ...
});
