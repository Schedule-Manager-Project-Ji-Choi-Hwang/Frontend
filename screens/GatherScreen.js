import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Animated,
    ActivityIndicator,
    TextInput
} from 'react-native';
import Config from '../config/config';
import axios from "axios";
import { FAB, Provider } from "react-native-paper";
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddStudyPostModal from "./AddStudyPostModal";
import StudyPostDetailModal from "./StudyPostDetailModal"
import StudyItem from "./components/StudyPostItem";
import Header from './components/Header';
import SignInScreen from './Auth/SignInScreen';


export default function GatherScreen() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastPostId, setLastPostId] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false); // 모달 상태 추가
    const [postDetail, setPostDetail] = useState(null);
    const [postDetailModalVisible, setPostDetailModalVisible] = useState(false);
    const [isSignInModalVisible, setSignInModalVisible] = useState(false);

    const [addState, setAddState] = useState(false);
    const [editState, setEditState] = useState(false);
    const [deleteState, setDeleteState] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchLast, setSearchLast] = useState(false);
    const [myPost, setMyPost] = useState(false);
    const [FABStatus, setFABStatus] = useState(false);

    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const navigation = useNavigation();

    const performSearch = async () => {
        if (isLoading) return; // 이미 로딩 중이면 추가 요청을 방지

        setIsLoading(true);
        setPosts([]);
        setLastPostId(null);

        try {
            const params = { studyName: searchText };
            const response = await axios.get(`${Config.MY_IP}:8080/study-board`, { params });
            if (response.status === 200) {
                const newPosts = response.data.data.content;
                setPosts(newPosts); // 새 검색 결과로 posts 업데이트

                if (newPosts.length > 0) {
                    setLastPostId(newPosts[newPosts.length - 1].id); // 마지막 게시글 ID 업데이트
                }
                if (response.data.data.last) {
                    setSearchLast(true);
                }
            } else {
                // 에러 처리
                console.log('Error fetching search results:', response.status);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const performSearchs = async () => {
        if (isLoading || searchLast) return; // 이미 로딩 중이거나 마지막 페이지에 도달했으면 추가 요청 방지

        setIsLoading(true);

        try {
            const params = {
                studyName: searchText,
                lastPostId: lastPostId // 추가: 마지막 게시물 ID를 파라미터로 전달
            };
            const response = await axios.get(`${Config.MY_IP}:8080/study-board`, { params });
            if (response.status === 200) {
                const newPosts = response.data.data.content;

                setPosts(prevPosts => [...prevPosts, ...newPosts]);

                if (newPosts.length > 0) {
                    setLastPostId(newPosts[newPosts.length - 1].id);
                }

                if (response.data.data.last) {
                    setSearchLast(true);
                }
            } else {
                // 에러 처리
                console.log('Error fetching search results:', response.status);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const closePostDetailModal = () => {
        setPostDetailModalVisible(false);
    };

    const fetchPosts = async () => {
        if (isLoading) return; // 이미 로딩 중이면 추가 요청을 방지

        // "내가 작성한 글 보기"가 활성화된 경우 무한 스크롤 중지
        // if (isLoading || myPost) return;

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
            } else if (response.status === 400) {
                setPosts([]);
            }
            console.log(`모든 글 보기 목록 : ${posts}`);
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
                console.log(`내가 작성한 글 목록 : ${posts}`);
            } else if (response.status === 400) {
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
                { headers: { Authorization: token } });
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
                { headers: { Authorization: token } });
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
        setModalVisible(false);
    };

    useEffect(() => {
        if (editState) {
            setEditState(false);
            setMyPost(true);
            fetchMyPosts();
        } else if (!myPost || addState || deleteState) {
            if (deleteState && myPost) {
                fetchMyPosts();
            } else if (deleteState && !myPost) {
                fetchPosts();
                setMyPost(false);
            } else if (addState) {
                if (!myPost) {
                    fetchPosts();
                } else {
                    fetchPosts();
                    setMyPost(false);
                }

            } else if (!myPost && !addState && !deleteState) {
                fetchPosts();
            }
            setAddState(false);
            setDeleteState(false);
        }
    }, [myPost, addState, editState, deleteState]);

    const renderItem = ({ item }) => (
        <StudyItem
            item={item}
            onPressItem={isLoggedIn ? (
                openPostDetailModal
            ) : (
                showSignInModal
            )}
            myPost={myPost}
            setDeleteState={() => setDeleteState(true)}
            setPosts={() => setPosts([])}
            setLastPostId={() => setLastPostId(null)}
            setEditState={() => setEditState(true)}
        />
    );

    const onFABStateChange = ({ open }) => setFABStatus(open);

    const showSignInModal = () => setSignInModalVisible(true);
    const hideSignInModal = () => setSignInModalVisible(false);

    return (
        <Provider>
            <View style={styles.container}>
                <Header
                    label={"스터디 게시판"}
                    navigation={navigation}
                />
                <SignInScreen
                    isVisible={isSignInModalVisible}
                    onClose={hideSignInModal}
                    onLoginSuccess={() => setIsLoggedIn(true)}
                />
                {myPost && (
                    <>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            setPosts([]);
                            setLastPostId(null);
                            setMyPost(false);
                            setTimeout(() => {
                                setMyPost(false);
                            }, 200);
                        }}>
                            <Text style={styles.buttonText}>모든 글 보기</Text>
                        </TouchableOpacity>
                    </>
                )}
                {!myPost && (
                    <>
                        <View style={styles.searchSection}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="검색..."
                                value={searchText}
                                onChangeText={text => setSearchText(text)}
                            />
                            <TouchableOpacity style={styles.searchButton} onPress={() => {
                                setPosts([]);
                                setLastPostId(null);
                                setSearchLast(false);
                                setTimeout(() => {
                                    setMyPost(false);
                                }, 200);
                                performSearch()
                            }}>
                                <Text style={styles.searchButtonText}>검색</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
                {posts.length === 0 ? (
                    // posts 배열이 비어있을 때 표시될 텍스트
                    <View style={styles.centeredView}>
                        <Text style={styles.noPostsText}>내가 작성한 글이 없어요</Text>
                    </View>
                ) : (
                    <FlatList
                        data={posts}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        onEndReached={() => {
                            if (searchText.trim() !== '' && !searchLast) {
                                performSearchs();
                            } else if (!myPost && !(searchText.trim() !== '')) {
                                fetchPosts();
                            }
                        }} // 리스트 끝에 도달하면 추가 게시글 로드
                        onEndReachedThreshold={0.5} // 리스트의 하단 50%에 도달했을 때 이벤트 발생
                        ListFooterComponent={isLoading ? <ActivityIndicator size="large" /> : null}
                    />
                )}
                <AddStudyPostModal
                    isVisible={isModalVisible}
                    setAddState={() => setAddState(true)}
                    setPosts={() => setPosts([])}
                    setLastPostId={() => setLastPostId(null)}
                    fetchPosts={fetchPosts}
                    closeModal={closeModal}
                />
                <StudyPostDetailModal
                    isVisible={postDetailModalVisible}
                    onClose={closePostDetailModal}
                    fetchPosts={fetchPosts}
                    postDetail={postDetail}
                    fetchpost={updatePostDetailModal}
                    setEditState={() => setEditState(true)}
                    setDeleteState={() => setDeleteState(true)}
                    setPosts={() => setPosts([])}
                    setLastPostId={() => setLastPostId(null)}
                />
                {isLoggedIn ? (
                    <>
                        <FAB.Group
                            open={FABStatus}
                            icon={FABStatus ? 'close' : 'plus'}
                            actions={[
                                {
                                    icon: 'calendar-edit',
                                    label: '내가 작성한 글 보기',
                                    onPress: () => {
                                        setMyPost(true);
                                        setPosts([]);
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
                                    setFABStatus(!FABStatus);
                                }
                            }}
                        />
                    </>
                ) : (
                    <>
                    </>
                )}

            </View>
        </Provider>

    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noPostsText: {
        fontSize: 18,
        color: 'gray'
    },
    searchSection: {
        flexDirection: 'row',
        padding: 10,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    searchButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
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
    header: {
        flexDirection: 'row',
        height: 45,
        backgroundColor: 'white',
        alignItems: 'center'
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
    }
});