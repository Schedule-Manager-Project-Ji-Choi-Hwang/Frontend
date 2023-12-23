import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal } from 'react-native';
import {IconButton, Menu} from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Config from "../../config/config";
import EditStudyPostModal from "./EditStudyPostModal";

const StudyItem = ({ item, onPressItem, myPost, setPosts, setLastPostId, setDeleteState, setEditState }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const scaleValue = new Animated.Value(1);


    const toggleMenu = () => setMenuVisible(!menuVisible);
    const handleEdit = () => {
        setEditModalVisible(true); // 편집 모달 열기
        toggleMenu();
    };

    const handleDelete = async () => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            await axios.delete(`${Config.MY_IP}:8080/study-board/${item.id}/delete`,{
                headers: { Authorization: token }
            });
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleDeleteUpdate = async () => {
        await handleDelete();
        // await fetchPosts();
        setPosts();
        setLastPostId();
        setDeleteState();
        toggleMenu();
    };

    return (
        <View>
            <TouchableOpacity style={[styles.post, { transform: [{ scale: scaleValue }] }]} onPress={() => onPressItem(item.id)}>
                <View style={styles.itemContainer}>
                    <View style={styles.postDetails}>
                        <Text style={styles.postTitle}>{item.studyName}</Text>
                        <Text style={styles.textStyle}>태그: {item.tag ? item.tag : '없음'}</Text>
                        <Text style={styles.textStyle}>모집 인원: {item.currentMember} / {item.recruitMember}</Text>
                        <Text style={styles.textStyle}>온/오프라인: {item.onOff ? '온라인' : '오프라인'}</Text>
                        <Text style={styles.textStyle}>지역: {item.area ? item.area : '미정'}</Text>
                    </View>
                    {myPost && (
                        <View style={styles.menuContainer}>
                            <Menu
                                visible={menuVisible}
                                onDismiss={toggleMenu}
                                anchor={
                                    <IconButton
                                        icon="dots-vertical"
                                        onPress={toggleMenu}
                                    />
                                }>
                                <Menu.Item onPress={handleEdit} title="편집" />
                                <Menu.Item onPress={handleDeleteUpdate} title="삭제" />
                            </Menu>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
            <EditStudyPostModal
                isVisible={editModalVisible}
                onDismiss={() => setEditModalVisible(false)}
                item={item}
                setPosts={setPosts}
                setLastPostId={setLastPostId}
                setEditState={setEditState}
                // 필요한 경우, 편집 완료 후 상태를 업데이트하는 로직 추가
            />
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
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
    postDetails: {
        flex: 1,
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
    menuContainer: {
        // 메뉴 아이콘 스타일 조정
    },
    // 나머지 스타일
});

export default StudyItem;