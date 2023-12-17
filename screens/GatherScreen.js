import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, StyleSheet, Modal} from 'react-native';
import Config from '../config/config';
import axios from "axios";
import {IconButton} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddStudyPostModal from "./AddStudyPostModal";

export default function GatherScreen() {
    const [posts, setPosts] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false); // 모달 상태 추가


    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${Config.MY_IP}:8080/study-board`);
            if (response.status == 200) {
                setPosts(response.data.data.content);
            }else if (response.status === 400) {
                setPosts([]);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setPosts([]);
        }
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const closeModal = () => {
        setModalVisible(false); // 모달을 닫는 함수
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.post}>
            <Text style={styles.postTitle}>{item.studyName}</Text>
            <Text>태그: {item.tag ? item.tag : '없음'}</Text>
            <Text>모집 인원: {item.recruitMember}</Text>
            <Text>온/오프라인: {item.onOff ? '온라인' : '오프라인'}</Text>
            <Text>지역: {item.area ? item.area : '미정'}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <IconButton
                icon="plus"
                color="black"
                size={24}
                style={styles.addButton}
                onPress={toggleModal} // 모달 토글 함수 연결
            />
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            <Modal
                visible={isModalVisible}
                onRequestClose={toggleModal}
                // 필요한 경우 모달 스타일 지정
            >
                <AddStudyPostModal
                    fetchPosts={fetchPosts}
                    closeModal={closeModal}
                />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0', // 전체 배경색 변경
    },
    post: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10, // 모서리 둥글게
        shadowColor: '#000', // 그림자 색
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // 안드로이드용 그림자 효과
    },
    postTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10, // 제목 아래 마진 추가
    },
    // 기타 텍스트 스타일
    textStyle: {
        fontSize: 16,
        color: '#333', // 텍스트 색상 변경
    },
    addButton: {
        position: 'absolute',
        right: 16,
        bottom: 16, // 위치 조정
    },
});