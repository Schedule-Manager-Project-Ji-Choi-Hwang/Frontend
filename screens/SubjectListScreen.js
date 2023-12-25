import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { IconButton, Divider, Card, Menu, Provider } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./components/Header";
import Config from "../config/config";
import SubjectModal from "./components/SubjectModal";

const SubjectListScreen = () => {
    const [items, setItems] = useState([]);
    const [selectedSubject, setSelectSubject] = useState(null);
    const [addModal, setAddModal] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);

    useEffect(() => {
        fetchSubjectData();
    }, []);

    const fetchSubjectData = async () => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            if (!token) {
                console.log('No access token');
                return null;
            }
            const response = await axios.get(`${Config.MY_IP}:8080/subjects`, {
                headers: { Authorization: token }
            });

            if (response && response.data) {
                subjectData(response.data.data);
            }
        } catch (error) {
            console.log('ERROR : ', error);
        }
    }

    const subjectData = (data) => {
        const subjectArray = [];
        data.forEach(subject => {
            const subjectName = subject.subjectName;
            const subjectId = subject.subjectId;
            const subjectColor = subject.color;
            subjectArray.push({
                subjectId: subjectId,
                subjectName: subjectName,
                color: subjectColor
            });
        });
        setItems(subjectArray);
    }

    const closeMenu = () => {
        setSelectSubject(null);
    };

    const renderSubjectCard = ({ item }) => {
        return (
            <Pressable>
                <Card style={{ margin: 10 }}>
                    <Card.Title
                        title={item.subjectName}
                        left={(props) => (
                            <View {...props} style={{
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                backgroundColor: item.color, // 이곳에 과목 색상 정보를 사용합니다.
                                marginRight: 10
                            }} />
                        )}
                        right={() => (
                            <Menu
                                visible={selectedSubject === item.subjectId}
                                onDismiss={closeMenu}
                                anchor={
                                    <IconButton
                                        icon="dots-vertical"
                                        onPress={() => setSelectSubject(item.subjectId)}
                                    />
                                }
                            >
                                <Menu.Item onPress={() => handleEdit(item)} title="편집" />
                                <Menu.Item onPress={() => handleDelete(item.subjectId)} title="삭제" />
                            </Menu>
                        )}
                    />
                </Card>
            </Pressable>
        );
    };

    const refreshSubjectData = () => {
        fetchSubjectData();
    };

    const handleEdit = (subject) => {
        setEditingSubject(subject);
        setAddModal(true);
        closeMenu();
    }

    const handleDelete = async (subjectId) => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            if (!token) {
                console.log('No access token');
                return;
            }

            await axios.delete(`${Config.MY_IP}:8080/subjects/${subjectId}/delete`, {
                headers: { Authorization: token }
            });
            refreshSubjectData();
        } catch (error) {
            console.log('Error', error);
        }
    }


    return (
        <Provider>
            <View style={Styles.container}>
                <Header
                    label={"내 과목"}
                />
                <View style={Styles.content}>
                    <View style={Styles.contentHeader}>
                        <Text style={Styles.contentText}>과목</Text>
                        <View style={{ flex: 3 }}></View>
                        <IconButton
                            style={Styles.contentIcon}
                            icon="plus"
                            iconColor="black"
                            size={25}
                            onPress={() => setAddModal(true)}
                        />
                        <SubjectModal
                            visible={addModal}
                            placeholder={editingSubject ? editingSubject.subjectName : "과목 명을 입력하세요."}
                            onClose={() => {
                                setAddModal(false);
                                setEditingSubject(null);
                            }}
                            onSubjectAdded={refreshSubjectData}
                            editingSubject={editingSubject}
                        />
                    </View>
                    <Divider
                        style={{ backgroundColor: 'black' }}
                        horizontalInset={true}
                    />
                    <FlatList
                        data={items}
                        renderItem={renderSubjectCard}
                        keyExtractor={(item) => item.subjectId.toString()}
                    />
                </View>
            </View>
        </Provider>
    )
}

export default SubjectListScreen;

const Styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    content: {
        margin: 15,
        marginTop: 10
    },
    contentHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    contentText: {
        flex: 2,
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center"
    },
    contentIcon: {
        flex: 1,
        alignItems: "center"
    }
})