import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from "react-native";
import {IconButton, Card, Title, Paragraph, Menu, Provider} from "react-native-paper";
import axios from "axios";
import Config from "../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StudyModal from './components/StudyAnnouncementModal'; // StudyModal 컴포넌트 임포트

const StudyCard = ({ item, onLeave }) => {
    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const leaveStudy = async () => {
        // 탈퇴 요청 로직
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            await axios.delete(`${Config.MY_IP}:8080/study-board/${item.studyPostId}/study-member/withdrawal`, {
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
                            <Menu.Item onPress={() => { console.log('Edit'); }} title="편집" />
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
                {/* 여기에 더 많은 스터디 정보를 추가할 수 있습니다. */}
            </Card.Content>
        </Card>
    );
};

export default function ListScreen() {
    const [studies, setStudies] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStudy, setSelectedStudy] = useState(null);
    const [loginRequestMessage, setLoginRequestMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchStudies();
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

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
            console.log(token);
            if (!token) {
                setLoginRequestMessage('로그인을 해주세요');
                return;
            }

            const response = await axios.get(`${Config.MY_IP}:8080/my-study-board`, {
                headers: {Authorization: token}
            });
            setStudies(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Provider>
            <View style={Styles.container}>
                {loginRequestMessage ? (
                    <View style={Styles.messageContainer}>
                        <Text style={Styles.messageText}>{loginRequestMessage}</Text>
                    </View>
                ) : (
                    <>
                        <View style={Styles.header}>
                            <View style={{flex: 3, justifyContent: 'center'}}>
                                <Text style={Styles.headerTitle}>스터디 목록</Text>
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                        {studies.length > 0 ? (
                            <FlatList
                                data={studies}
                                renderItem={({item}) => (
                                    <TouchableOpacity onPress={() => openModal(item)}>
                                        <StudyCard item={item} onLeave={updateStudies}/>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={item => item.studyPostId.toString()}
                            />
                        ) : (
                            <View style={Styles.emptyContainer}>
                                <Text>가입된 스터디가 없어요</Text>
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
    );
}



    const Styles = StyleSheet.create({
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageText: {
        fontSize: 18,
        color: 'red',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        // 여기에 모달의 스타일을 정의합니다.
    },
    container: {
        flex: 1
        //backgroundColor: 'red',
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
    settingBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
})