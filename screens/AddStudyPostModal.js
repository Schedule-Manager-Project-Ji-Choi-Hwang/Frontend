import React, { useState } from 'react';
import {View, TextInput, Button, StyleSheet, Switch, Text, Modal} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Config from "../config/config";

const AddStudyPostModal = ({fetchPosts, closeModal}) => {
    const [studyName, setStudyName] = useState('');
    const [tag, setTag] = useState();
    const [recruitMember, setRecruitMember] = useState('');
    const [onOff, setOnOff] = useState(false);
    const [area, setArea] = useState('');
    const [post, setPost] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(true); // 모달 가시성 상태

    const handleAddPost = async () => {
        try {
            const postData = {
                studyName: studyName,
                tag: tag,
                recruitMember: recruitMember,
                onOff: onOff,
                area: area,
                post: post
            };
            console.log(postData);
            const token = await AsyncStorage.getItem('AccessToken');
            await axios.post(`${Config.MY_IP}:8080/study-board/post`, postData,
                {headers: {Authorization: token}}
            );

            closeModal();
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    const handlePost = async () => {
        await handleAddPost();
        await fetchPosts();
    };

    const handleCloseModal = () => {
        setIsModalVisible(false); // 모달을 닫음
        closeModal(); // 부모 컴포넌트의 closeModal 호출
    };

    return (
        <Modal
            visible={isModalVisible}
            onRequestClose={handleCloseModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalView}>
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
                    <Text>Online/Offline: </Text>
                    <Switch
                        value={onOff}
                        onValueChange={setOnOff}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="스터디 지역"
                    value={area}
                    onChangeText={setArea}
                />
                <TextInput
                    style={styles.input}
                    placeholder="글을 작성해 주세요."
                    value={post}
                    onChangeText={setPost}
                    multiline
                />
                <Button
                    title="등록"
                    onPress={handlePost}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        backgroundColor: '#28a745', // 버튼 색상
        color: '#ffffff', // 버튼 텍스트 색상
        padding: 10,
        borderRadius: 5, // 버튼 모서리 둥글게
    },
});


export default AddStudyPostModal;
