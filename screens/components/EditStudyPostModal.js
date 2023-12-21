import React, { useState } from 'react';
import {Modal, View, Text, TextInput, Button, StyleSheet, Switch, TouchableOpacity} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Config from "../../config/config";

const EditStudyPostModal = ({ isVisible, onDismiss, item, setPosts, setLastPostId, setEditState }) => {
    const [editStudyName, setEditStudyName] = useState(item.studyName);
    const [editTag, setEditTag] = useState(item.tag);
    const [editRecruitMember, setEditRecruitMember] = useState(item.recruitMember.toString());
    const [editOnOff, setEditOnOff] = useState(item.onOff);
    const [editArea, setEditArea] = useState(item.area);
    const [editPost, setEditPost] = useState(item.post);

    // const saveEdit = () => {
    //     // 편집 저장 로직
    //     // 예: 서버에 편집된 데이터를 전송
    //     onDismiss();
    // };

    const handleEdit = async () => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            const updatedData = {
                studyName: editStudyName,
                tag: editTag,
                recruitMember: editRecruitMember,
                onOff: editOnOff,
                area: editArea,
                post: editPost
            };
            await axios.patch(`${Config.MY_IP}:8080/study-board/${item.id}/edit`, updatedData, {
                headers: { Authorization: token }
            });
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };

    const handleEditUpdate = async () => {
        await handleEdit();
        // await fetchpost(postDetail.id);
        // await fetchPosts();
        // setIsEditMode(false);
        setPosts();
        setLastPostId();
        setEditState();
        onDismiss();
    };

    return (
        <Modal
            visible={isVisible}
            transparent
            onRequestClose={onDismiss}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
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
                    <TouchableOpacity onPress={() => onDismiss()} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>돌아가기</Text>
                    </TouchableOpacity>
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

export default EditStudyPostModal;