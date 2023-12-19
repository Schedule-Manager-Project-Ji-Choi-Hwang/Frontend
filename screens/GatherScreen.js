import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import Config from '../config/config';
import axios from "axios";
import {FAB, IconButton} from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddStudyPostModal from "./AddStudyPostModal";
import StudyPostDetailModal from "./StudyPostDetailModal"


export default function GatherScreen() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastPostId, setLastPostId] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false); // 모달 상태 추가
    const [postDetail, setPostDetail] = useState(null);
    const [postDetailModalVisible, setPostDetailModalVisible] = useState(false);

    const [myPost, setMyPost] = useState(false);

    const [FABStatus, setFABStatus] = useState(false);

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
        if (isLoading) return; // 이미 로딩 중이면 추가 요청을 방지

        // "내가 작성한 글 보기"가 활성화된 경우 무한 스크롤 중지
        if (isLoading || myPost) return;

        setIsLoading(true);
        try {
            const response = await axios.get(`${Config.MY_IP}:8080/study-board`, {
                params: { lastPostId }
            });
            if (response.status == 200) {
                const newPosts = response.data.data.content;
                setPosts(prevPosts => [...prevPosts, ...newPosts]);

                // 마지막 게시글의 ID를 업데이트
                if (newPosts.length > 0) {
                    setLastPostId(newPosts[newPosts.length - 1].id);
                }
            }else if (response.status === 400) {
                setPosts([]);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMyPosts = async () => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            const response = await axios.get(`${Config.MY_IP}:8080/my-postlist`, {
                headers: { Authorization: token }
            });
            if (response.status == 200) {
                setPosts(response.data.data);
                console.log(posts);
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

    const updatePostDetailModal = async (studyBoardId) => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            const response = await axios.get(`${Config.MY_IP}:8080/study-board/${studyBoardId}`,
                {headers: {Authorization: token}});
            if (response.status === 200) {
                setPostDetail(response.data);
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

    const onFABStateChange = ({ open }) => setFABStatus(open);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{flex: 3, justifyContent: 'center'}}>
                    <Text style={styles.headerTitle}>스터디 게시글</Text>
                </View>
                <View style={{flex: 1}}></View>
            </View>
            {myPost && (
                <>
                    <TouchableOpacity style={styles.button} onPress={async () => {await fetchPosts();
                        setMyPost(false);
                        setLastPostId(null);
                    }}>
                        <Text style={styles.buttonText}>모든 글 보기</Text>
                    </TouchableOpacity>
                </>
            )}
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                onEndReached={myPost ? null : fetchPosts} // 리스트 끝에 도달하면 추가 게시글 로드
                onEndReachedThreshold={0.5} // 리스트의 하단 50%에 도달했을 때 이벤트 발생
                ListFooterComponent={isLoading ? <ActivityIndicator size="large" /> : null}
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
                fetchpost={updatePostDetailModal}
            />
            <FAB.Group
                open={FABStatus}
                icon={FABStatus ? 'close' : 'plus'}
                actions={[
                    {
                        icon: 'calendar-edit',
                        label: '내가 작성한 글 보기',
                        onPress: () => {
                            setMyPost(true);
                            fetchMyPosts();
                        }
                    },
                    {
                        icon: 'account-group',
                        label: '게시글 작성',
                        onPress: () => {
                            if (FABStatus) {
                                toggleModal();
                            }
                        }
                    }
                ]}
                onStateChange={onFABStateChange}
                onPress={() => {
                    if (FABStatus) {
                        setFABStatus(!open);
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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