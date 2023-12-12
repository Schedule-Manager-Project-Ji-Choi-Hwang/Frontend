import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';
import axios from 'axios'; // axios 라이브러리 사용
import Config from '../../config/config';
import AsyncStorage from "@react-native-async-storage/async-storage"; // Config 파일 또는 필요한 설정

const AnnouncementDetailModal = ({ visible, onDismiss, announcement, studyPostId }) => {
    const [announcementData, setAnnouncementData] = useState({});
    const [commentData, setCommentData] = useState([]);

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
    }, [visible, studyPostId]);

    const fetchAnnouncementData = async () => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            const response = await axios.get(`${Config.MY_IP}:8080/study-board/${studyPostId}/study-announcements/${announcement.announcementId}`, {
                headers: { Authorization: token }
            });

            if (response.status === 200) {
                setAnnouncementData({
                    announcementId : response.data.data.announcementId,
                    announcementTitle : response.data.data.announcementTitle,
                    announcementPost : response.data.data.announcementPost,
                    announcementCreateDate : response.data.data.createDate
                });
                setCommentData(response.data.data.commentList);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal visible={visible} onDismiss={onDismiss} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
                    <IconButton icon="close" />
                </TouchableOpacity>
                {announcementData.announcementTitle && (
                    <>
                        <Text style={styles.title}>{announcementData.announcementTitle}</Text>
                        <View style={styles.separator} />
                        <Text style={styles.createDate}>{announcementData.announcementCreateDate}</Text>
                        <View style={styles.announcementBox}>
                            <Text style={styles.content}>{announcementData.announcementPost}</Text>
                        </View>
                        <ScrollView style={styles.commentsContainer}>
                            {commentData.map((comment, index) => (
                                <View key={index} style={styles.comment}>
                                    <Text style={styles.commentAuthor}>{comment.nickname}</Text>
                                    <Text style={styles.commentCreateDate}>{comment.lastModifiedDate}</Text>
                                    <Text style={styles.commentText}>{comment.comment}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    separator: {
        borderBottomColor: '#e0e0e0', // 선의 색상 지정
        borderBottomWidth: 1,         // 선의 두께 지정
        marginVertical: 8,            // 위아래 여백 지정
        width: '100%',                // 뷰의 너비를 100%로 설정
    },
    modalContainer: {
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
        shadowRadius: 3.84,
        elevation: 5,
        maxHeight: '90%', // 모달의 최대 높이를 화면 높이의 80%로 제한
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    announcementBox: {
        width: '100%',
        marginTop: 10,
        backgroundColor: '#f2f2f2', // 박스의 배경색
        borderRadius: 3, // 모서리 둥글기
        padding: 15, // 내부 여백
        shadowColor: '#000', // 그림자 색상
        shadowOffset: { width: 0, height: 1 }, // 그림자 위치
        shadowOpacity: 0.2, // 그림자 투명도
        shadowRadius: 1.41, // 그림자 둥글기
        elevation: 2, // 안드로이드에서의 그림자
        marginBottom: 15, // 아래쪽 여백
    },
    content: {
        fontSize: 16,
        color: '#333',
    },
    createDate: {
        alignSelf: 'flex-end', // 오른쪽 정렬
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    commentsContainer: {
        // maxHeight: 500, // ScrollView의 최대 높이 설정
        width: '100%',
        // flex: 1,
        // height: '300'

        // 기타 필요한 스타일
    },
    comment: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        position: 'relative', // 상대적 위치 설정
    },
    commentAuthor: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    commentCreateDate: {
        position: 'absolute', // 절대적 위치 설정
        top: 10, // 상단에서 10의 여백
        right: 10, // 우측에서 10의 여백
        fontSize: 12,
        color: '#666',
    },
    commentText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    // ... 기타 스타일 ...
});


export default AnnouncementDetailModal;

