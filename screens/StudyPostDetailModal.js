import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from '../config/config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const StudyPostDetailModal = ({ isVisible, onClose, postDetail, fetchPosts}) => {
    if (!postDetail) {
        return null;
    }

    const handleDelete = async () => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            await axios.delete(`${Config.MY_IP}:8080/study-board/${postDetail.id}/delete`, {
                headers: { Authorization: token }
            });

            // 게시글 삭제 후 처리 (예: 모달 닫기, 게시글 목록 새로고침 등)
            onClose(); // 모달 닫기
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleDeleteUpdate = async () => {
        await handleDelete();
        await fetchPosts();
    };

    return (
        <Modal visible={isVisible} transparent onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>{postDetail.studyName}</Text>
                    <TouchableOpacity onPress={handleDeleteUpdate} style={styles.deleteButton}>
                        <MaterialCommunityIcons name="trash-can-outline" size={24} color="#ff0000" />
                    </TouchableOpacity>
                    <Text style={styles.text}>분야: {postDetail.tag ? postDetail.tag : '없음'}</Text>
                    <Text style={styles.text}>모집 인원: {postDetail.recruitMember}</Text>
                    <Text style={styles.text}>온/오프라인: {postDetail.onOff ? '온라인' : '오프라인'}</Text>
                    <Text style={styles.text}>지역: {postDetail.area ? postDetail.area : '미정'}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    deleteButton: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // 진한 반투명 배경
    },
    modalContent: {
        backgroundColor: 'white', // 깨끗한 흰색 배경
        padding: 35,
        borderRadius: 25, // 부드러운 모서리
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.45, // 뚜렷한 그림자 효과
        shadowRadius: 10,
        elevation: 15,
        width: '90%', // 넓은 너비
        borderWidth: 2,
        borderColor: '#eaeaea', // 섬세한 경계선
    },
    title: {
        fontSize: 30,
        fontWeight: '800', // 매우 두꺼운 폰트
        color: '#333', // 진한 글씨 색상
        marginBottom: 30,
        textAlign: 'center',
    },
    text: {
        fontSize: 20,
        lineHeight: 32, // 넓은 줄 간격
        marginBottom: 18,
        color: '#555', // 중간 정도의 글씨 색상
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#1abc9c', // 티파니 색상
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default StudyPostDetailModal;