import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { IconButton, Divider, Card, Menu, Provider } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./components/Header";
import Config from "../config/config";

const SubjectListScreen = () => {
    const [items, setItems] = useState([]);
    const [selectedSubject, setSelectSubject] = useState(null);

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
            subjectArray.push({
                subjectId: subjectId,
                subjectName: subjectName
            });
        });
        setItems(subjectArray);
    }

    const openMenu = (subjectId) => {
        setSelectSubject(subjectId);
    };

    const closeMenu = () => {
        setSelectSubject(null);
    };

    const renderSubjectCard = ({ item }) => {
        return (
            <Pressable>
                <Card style={{ margin: 10 }}>
                    <Card.Title
                        title={item.subjectName}
                        right={() => (
                            <>
                                <IconButton
                                    icon="dots-vertical"
                                    onPress={() => openMenu(item.subjectId)}
                                />
                                <Menu
                                    visible={selectedSubject === item.subjectId}
                                    onDismiss={closeMenu}
                                    anchor={item.subjectId}
                                >
                                    <Menu.Item onPress={() => { console.log('Edit'); }} title="편집" />
                                    <Menu.Item onPress={() => { console.log('Delete') }} title="삭제" />
                                </Menu>
                            </>
                        )}
                    />
                </Card>
            </Pressable>
        );
    };


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
                            size={35}
                            onPress={() => console.log("Add Subject")}
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
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center"
    },
    contentIcon: {
        flex: 1,
        alignItems: "center"
    }
})