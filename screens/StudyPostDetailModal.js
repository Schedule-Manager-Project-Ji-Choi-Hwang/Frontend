import React, {useEffect, useState} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Switch} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from '../config/config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const StudyPostDetailModal = ({ isVisible, onClose, postDetail, fetchPosts, fetchpost, setEditState, setPosts, setLastPostId}) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editStudyName, setEditStudyName] = useState('');
    const [editTag, setEditTag] = useState('');
    const [editRecruitMember, setEditRecruitMember] = useState('');
    const [editOnOff, setEditOnOff] = useState(false);
    const [editArea, setEditArea] = useState('');
    const [editPost, setEditPost] = useState('');

    useEffect(() => {

    }, [postDetail]);

    // 수정 모드로 전환할 때 상태 초기화
    const toggleEditMode = () => {
        if (postDetail) {
            setEditStudyName(postDetail.studyName);
            setEditTag(postDetail.tag);
            setEditRecruitMember(postDetail.recruitMember);
            setEditOnOff(postDetail.onOff);
            setEditArea(postDetail.area);
            setEditPost(postDetail.post);
            setIsEditMode(true);
        }
    };

    if (!postDetail) {
        return null;
    }

    const handleDelete = async () => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            await axios.delete(`${Config.MY_IP}:8080/study-board/${postDetail.id}/delete`,{
                headers: { Authorization: token }
            });

            // 게시글 삭제 후 처리 (예: 모달 닫기, 게시글 목록 새로고침 등)
            onClose(); // 모달 닫기
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleEdit = async () => {
        try {
            console.log(postDetail);
            const token = await AsyncStorage.getItem('AccessToken');
            const updatedData = {
                studyName: editStudyName,
                tag: editTag,
                recruitMember: editRecruitMember,
                onOff: editOnOff,
                area: editArea,
                post: editPost
            };
            await axios.patch(`${Config.MY_IP}:8080/study-board/${postDetail.id}/edit`, updatedData, {
                headers: { Authorization: token }
            });
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };

    const handleDeleteUpdate = async () => {
        await handleDelete();
        await fetchPosts();
    };

    const handleEditUpdate = async () => {
        await handleEdit();
        await fetchpost(postDetail.id);
        // await fetchPosts();
        setIsEditMode(false);
        setPosts();
        setLastPostId();
        setEditState();
    };

    return (
        <Modal visible={isVisible} transparent onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {isEditMode ? (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="스터디 이름"
                                value={editStudyName}
                                onChangeText={setEditStudyName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="분류"
                                value={editTag}
                                onChangeText={setEditTag}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="모집 인원(1~20명)"
                                value={editRecruitMember}
                                onChangeText={setEditRecruitMember}
                                keyboardType="numeric"
                            />
                            <View style={styles.switchContainer}>
                                <Text>Online/Offline: </Text>
                                <Switch
                                    value={editOnOff}
                                    onValueChange={setEditOnOff}
                                />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="스터디 지역"
                                value={editArea}
                                onChangeText={setEditArea}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="글을 작성해 주세요."
                                value={editPost}
                                onChangeText={setEditPost}
                                multiline
                            />
                            {/* 나머지 필드에 대한 입력 필드 추가... */}
                            <TouchableOpacity onPress={handleEditUpdate} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>업데이트</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsEditMode(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>돌아가기</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.title}>{postDetail.studyName}</Text>
                            {postDetail.authority && (
                                <>
                                    <TouchableOpacity onPress={() => toggleEditMode()} style={styles.updateButton}>
                                        <MaterialCommunityIcons name="pencil-outline" size={24} color="#0000ff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleDeleteUpdate} style={styles.deleteButton}>
                                        <MaterialCommunityIcons name="trash-can-outline" size={24} color="#ff0000" />
                                    </TouchableOpacity>
                                </>
                            )}
                            <Text style={styles.text}>분야: {postDetail.tag ? postDetail.tag : '없음'}</Text>
                            <Text style={styles.text}>모집 인원: {postDetail.recruitMember}</Text>
                            <Text style={styles.text}>온/오프라인: {postDetail.onOff ? '온라인' : '오프라인'}</Text>
                            <Text style={styles.text}>지역: {postDetail.area ? postDetail.area : '미정'}</Text>
                            <Text style={styles.text}>내용: {postDetail.post ? postDetail.post : '내용이 없어요'}</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>닫기</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#007bff', // 입력 필드 테두리 색상
        padding: 10,
        borderRadius: 5, // 입력 필드 모서리 둥글게
        backgroundColor: '#ffffff', // 입력 필드 배경색
        shadowColor: '#000', // 입력 필드 그림자 색
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    updateButton: {
        position: 'absolute',
        right: 40, // 위치 조정
        top: 10,
    },
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