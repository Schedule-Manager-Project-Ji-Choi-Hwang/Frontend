import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import Config from '../config/config';
import axios from "axios";
import {IconButton} from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddStudyPostModal from "./AddStudyPostModal";
import StudyPostDetailModal from "./StudyPostDetailModal"


export default function GatherScreen() {
    const [posts, setPosts] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false); // 모달 상태 추가
    const [postDetail, setPostDetail] = useState(null);
    const [postDetailModalVisible, setPostDetailModalVisible] = useState(false);

    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

    const scaleValue = new Animated.Value(1);

    const startAnimation = () => {
        Animated.timing(scaleValue, {
            toValue: 0.95,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const resetAnimation = () => {
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const closePostDetailModal = () => {
        setPostDetailModalVisible(false);
    };


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

    const openPostDetailModal = async (studyBoardId) => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            const response = await axios.get(`${Config.MY_IP}:8080/study-board/${studyBoardId}`,
                {headers: {Authorization: token}});
            if (response.status === 200) {
                setPostDetail(response.data);
                setPostDetailModalVisible(true);
            }
        } catch (error) {
            console.error('Error fetching post details:', error);
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
        <AnimatedTouchableOpacity
            onPressIn={startAnimation}
            onPressOut={resetAnimation}
            onPress={() => openPostDetailModal(item.id)}
            style={[styles.post, { transform: [{ scale: scaleValue }] }]}
        >
            <View style={styles.postContent}>
                <Text style={styles.postTitle}>{item.studyName}</Text>
                <Text style={styles.textStyle}>태그: {item.tag ? item.tag : '없음'}</Text>
                <Text style={styles.textStyle}>모집 인원: {item.recruitMember}</Text>
                <Text style={styles.textStyle}>온/오프라인: {item.onOff ? '온라인' : '오프라인'}</Text>
                <Text style={styles.textStyle}>지역: {item.area ? item.area : '미정'}</Text>
            </View>
        </AnimatedTouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            <IconButton
                icon={() => (
                    <MaterialCommunityIcons name="plus" color="white" size={24} />
                )}
                style={styles.addButton}
                onPress={toggleModal}
            />
            <AddStudyPostModal
                isVisible={isModalVisible}
                fetchPosts={fetchPosts}
                closeModal={closeModal}
            />
            <StudyPostDetailModal
                isVisible={postDetailModalVisible}
                onClose={closePostDetailModal}
                fetchPosts={fetchPosts}
                postDetail={postDetail}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    postContent: {
        padding: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    post: {
        backgroundColor: '#f9f9f9',
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    postTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    textStyle: {
        fontSize: 16,
        color: '#555',
    },
    addButton: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#5d3b8a', // 더 진한 보라색
        width: 60, // 버튼 너비 증가
        height: 60, // 버튼 높이 증가
        borderRadius: 15, // 모서리 둥글기 조정
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 12, // 그림자 효과
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
    },
});