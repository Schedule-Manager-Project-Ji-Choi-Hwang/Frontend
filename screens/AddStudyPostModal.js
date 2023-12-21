import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Switch, Text, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Config from "../config/config";

const AddStudyPostModal = ({isVisible, setAddState, setPosts, setLastPostId, fetchPosts, closeModal}) => {
    const [studyName, setStudyName] = useState('');
    const [tag, setTag] = useState();
    const [recruitMember, setRecruitMember] = useState('');
    const [onOff, setOnOff] = useState(false);
    const [area, setArea] = useState('');
    const [post, setPost] = useState('');

    const resetForm = () => {
        setStudyName('');
        setTag(undefined);
        setRecruitMember('');
        setOnOff(false);
        setArea('');
        setPost('');
    };

    const handleAddPost = async () => {
        try {
            let defaultArea;
            if (onOff) {
                defaultArea = "온라인";
            } else {
                defaultArea = area;
            }

            const postData = {
                studyName: studyName,
                tag: tag,
                recruitMember: recruitMember,
                onOff: onOff,
                area: defaultArea,
                post: post
            };
            console.log(postData);
            const token = await AsyncStorage.getItem('AccessToken');
            await axios.post(`${Config.MY_IP}:8080/study-board/post`, postData,
                {headers: {Authorization: token}}
            );

            resetForm();
            closeModal();
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    const handlePost = async () => {
        await handleAddPost();
        setPosts();
        setLastPostId();
        setAddState();
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.outerContainer}>
                <View style={styles.modalView}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={closeModal}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="스터디 이름"
                        value={studyName}
                        onChangeText={setStudyName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="분류"
                        value={tag}
                        onChangeText={setTag}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="모집 인원(1~20명)"
                        value={recruitMember}
                        onChangeText={setRecruitMember}
                        keyboardType="numeric"
                    />
                    <View style={styles.switchContainer}>
                        <Text>Offline/Online: </Text>
                        <Switch
                            value={onOff}
                            onValueChange={setOnOff}
                        />
                    </View>
                    <TextInput
                        style={[styles.input, !onOff ? styles.inputActive : styles.inputInactive]}
                        placeholder="스터디 지역"
                        value={area}
                        onChangeText={setArea}
                        editable={!onOff} // 스위치가 온라인 상태일 때 비활성화
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="글을 작성해 주세요."
                        value={post}
                        onChangeText={setPost}
                        multiline
                    />
                    <TouchableOpacity style={styles.button} onPress={handlePost}>
                        <Text style={styles.buttonText}>등록</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    inputActive: {
        // 활성화 상태 스타일
    },
    inputInactive: {
        // 비활성화 상태 스타일
        backgroundColor: '#e1e1e1', // 희미한 배경색
        borderColor: '#aaa', // 희미한 테두리 색상
        color: '#aaa', // 희미한 텍스트 색상
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: '#ccc', // 버튼 배경색
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#333', // 텍스트 색상
        fontSize: 16, // 텍스트 크기
    },
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    },
    modalView: {
        width: '80%',
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
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5', // 배경색 설정
        borderRadius: 10, // 모서리 둥글게
        borderWidth: 1,
        borderColor: '#e1e1e1', // 테두리 색상 및 두께
        shadowColor: '#000', // 그림자 색
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
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
    button: {
        backgroundColor: '#007bff', // 버튼 색상
        padding: 12,
        borderRadius: 8, // 버튼 모서리 둥글게
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%', // 너비 조정
        marginTop: 10, // 마진 상단 추가
    },
    buttonText: {
        color: 'white', // 버튼 텍스트 색상
        fontSize: 16, // 텍스트 크기
    },
});


export default AddStudyPostModal;
