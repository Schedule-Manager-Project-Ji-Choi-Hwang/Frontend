import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { IconButton, Card, Button, Menu, Provider } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Config from "../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StudyModal from './components/StudyAnnouncementModal';
import SignInScreen from "./Auth/SignInScreen";
import Header from "./components/Header";


const StudyCard = ({ item, onLeave }) => {
    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const leaveStudy = async () => {
        // 탈퇴 요청 로직
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            await axios.delete(`${Config.MY_IP}:8080/study-board/${item.id}/study-member/withdrawal`, {
                headers: { Authorization: token }
            });
            // 부모 컴포넌트에 탈퇴 성공 알림
            onLeave();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card style={{ margin: 10 }}>
            <Card.Title
                title={item.studyName}
                left={(props) => (
                    item.authority === "LEADER" && (
                        <IconButton icon="crown" size={20} color="gold" />
                    )
                )}
                right={(props) => (
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <IconButton
                                {...props}
                                icon="dots-vertical"
                                onPress={openMenu}
                            />
                        }
                    >
                        <Menu.Item onPress={leaveStudy} title="탈퇴" />
                    </Menu>
                )}
            >

            </Card.Title>
            <Card.Content>
                <Text style={{ color: "white" }}>스터디 분야 : {item.tag}</Text>
                <Text style={{ color: "white" }}>
                    스터디 인원 : {item.currentMember}/{item.recruitMember}
                </Text>
            </Card.Content>
        </Card>
    );
};

const ListScreen = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [studies, setStudies] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStudy, setSelectedStudy] = useState(null);
    const [isSignInModalVisible, setSignInModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchStudies();
            } catch (error) {
                console.error(error);
            }
        };

        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('AccessToken');
            setIsLoggedIn(!!token);
        };
        if (isLoggedIn) {
            fetchData();
        }

        checkLoginStatus();
    }, [isLoggedIn]);

    const showSignInModal = () => setSignInModalVisible(true);
    const hideSignInModal = () => setSignInModalVisible(false);

    // 모달 열기
    const openModal = (study) => {
        setSelectedStudy(study);
        setModalVisible(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setModalVisible(false);
    };

    // 스터디 목록 갱신 함수
    const updateStudies = async () => {
        await fetchStudies();
    };

    const fetchStudies = async () => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            if (!token) {

                return;
            }
            const response = await axios.get(`${Config.MY_IP}:8080/my-study-board`, {
                headers: { Authorization: token }
            });
            setStudies(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Provider>
            <View style={Styles.container}>
                {!isLoggedIn ? (
                    <View style={Styles.loginPrompt}>
                        <Text style={Styles.loginPromptText}>로그인을 해주세요.</Text>
                        <Button onPress={showSignInModal} mode="contained">로그인</Button>
                        <SignInScreen
                            isVisible={isSignInModalVisible}
                            onClose={hideSignInModal}
                            onLoginSuccess={() => setIsLoggedIn(true)}
                        />
                    </View>
                ) : (
                    <>
                        <Header
                            label={"스터디 목록"}
                            navigation={navigation}
                        />
                        {studies.length > 0 ? (
                            <FlatList
                                data={studies}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => openModal(item)}>
                                        <StudyCard item={item} onLeave={updateStudies} />
                                    </TouchableOpacity>
                                )}
                                keyExtractor={item => item.id.toString()}
                            />
                        ) : (
                            <View style={Styles.emptyContainer}>
                                <Text style={{ color: 'grey' }}>가입된 스터디가 없어요</Text>
                            </View>
                        )}
                        <StudyModal
                            visible={modalVisible}
                            hideModal={closeModal}
                            studyData={selectedStudy || {}}
                        />
                    </>
                )}
            </View>
        </Provider>
    )
};

export default ListScreen;

const Styles = StyleSheet.create({
    container: {
        flex: 1
    },
    loginPrompt: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginPromptText: {
        fontSize: 18,
        marginBottom: 10
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '50%'
    }
});