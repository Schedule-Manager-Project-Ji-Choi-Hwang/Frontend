import React, { useState } from 'react';
import {Modal, View, Text, TextInput, Button, StyleSheet, Switch, TouchableOpacity} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Config from "../../config/config";
import DropDownPicker from "react-native-dropdown-picker";

const EditStudyPostModal = ({ isVisible, onDismiss, item, setPosts, setLastPostId, setEditState }) => {
    const [editStudyName, setEditStudyName] = useState(item.studyName);
    const [editTag, setEditTag] = useState(item.tag);
    const [editRecruitMember, setEditRecruitMember] = useState(item.recruitMember.toString());
    const [editOnOff, setEditOnOff] = useState(item.onOff);
    const [editArea, setEditArea] = useState(item.area);
    const [editPost, setEditPost] = useState(item.post);

    const [openTagDropDown, setOpenTagDropDown] = useState(false);
    const [selectedTag, setSelectedTag] = useState(item.tag);

    const [openAreaDropDown, setOpenAreaDropDown] = useState(false);
    const [selectedArea, setSelectedArea] = useState(item.area);

    const areas = [
        { label: '서울', value: '서울' },
        { label: '경기', value: '경기' },
        { label: '인천', value: '인천' },
        { label: '대전', value: '대전' },
        { label: '부산', value: '부산' },
        { label: '광주', value: '광주' },
        { label: '세종', value: '세종' },
        { label: '대구', value: '대구' },
        { label: '울산', value: '울산' },
        { label: '강원도', value: '강원도' },
        { label: '충청북도', value: '충청북도' },
        { label: '충청남도', value: '충청남도' },
        { label: '경상북도', value: '경상북도' },
        { label: '경상남도', value: '경상남도' },
        { label: '전라북도', value: '전라북도' },
        { label: '전라남도', value: '전라남도' },
        { label: '제주도', value: '제주도' },
    ];


    const tags = [
        { label: '개발', value: '개발' },
        { label: '어학', value: '어학' },
        { label: '자격증', value: '자격증' },
        { label: '기타', value: '기타' }
    ];

    // const saveEdit = () => {
    //     // 편집 저장 로직
    //     // 예: 서버에 편집된 데이터를 전송
    //     onDismiss();
    // };

    const handleEdit = async () => {
        try {
            let area;
            if (editOnOff == true) {
                area = "온라인";
            } else {
                area = selectedArea
            }

            const token = await AsyncStorage.getItem('AccessToken');
            const updatedData = {
                studyName: editStudyName,
                tag: selectedTag,
                recruitMember: editRecruitMember,
                onOff: editOnOff,
                area: area,
                post: editPost
            };
            await axios.patch(`${Config.MY_IP}:8080/study-board/${item.id}/edit`, updatedData, {
                headers: { Authorization: token }
            });
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };

    const handleEditUpdate = async () => {
        await handleEdit();
        // await fetchpost(postDetail.id);
        // await fetchPosts();
        // setIsEditMode(false);
        setPosts();
        setLastPostId();
        setEditState();
        onDismiss();
    };

    return (
        <Modal
            visible={isVisible}
            transparent
            onRequestClose={onDismiss}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.input}
                        placeholder="스터디 이름"
                        value={editStudyName}
                        onChangeText={setEditStudyName}
                    />
                    <DropDownPicker
                        style={{ zIndex: openTagDropDown ? 5000 : 1, position: 'relative' }}
                        containerStyle={{ zIndex: openTagDropDown ? 5000 : 1, position: 'relative' }}
                        theme="LIGHT"
                        open={openTagDropDown}
                        setOpen={setOpenTagDropDown}
                        items={tags}
                        value={selectedTag}
                        setValue={setSelectedTag}
                        placeholder="분야 선택"
                        autoScroll={true}
                    />
                    <View style={styles.counterContainer}>
                        <TextInput
                            style={styles.recruitInput}
                            placeholder="모집 인원(2~20명)"
                            value={editRecruitMember}
                            onChangeText={setEditRecruitMember}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity
                            style={styles.counterButton}
                            onPress={() => setEditRecruitMember(Math.max(2, editRecruitMember - 1))}>
                            <Text style={styles.counterButtonText}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.counterButton}
                            onPress={() => setEditRecruitMember(Math.min(20, editRecruitMember + 1))}>
                            <Text style={styles.counterButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.switchContainer}>
                        <Text>Online/Offline: </Text>
                        <Switch
                            value={editOnOff}
                            onValueChange={setEditOnOff}
                        />
                    </View>
                    <DropDownPicker
                        style={[
                            styles.dropDown,
                            { zIndex: openAreaDropDown ? 5000 : 1, position: 'relative' },
                            editOnOff ? styles.dropDownDisabled : {} // 비활성화 스타일 추가
                        ]}
                        containerStyle={{ zIndex: openAreaDropDown ? 5000 : 1, position: 'relative' }}
                        theme="LIGHT"
                        open={openAreaDropDown}
                        setOpen={setOpenAreaDropDown}
                        items={areas}
                        value={selectedArea}
                        setValue={setSelectedArea}
                        placeholder="지역 선택"
                        autoScroll={true}
                        disabled={editOnOff}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="글을 작성해 주세요."
                        value={editPost}
                        onChangeText={setEditPost}
                        multiline
                    />
                    {/* 나머지 필드에 대한 입력 필드 추가... */}
                    <TouchableOpacity onPress={handleEditUpdate} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>업데이트</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDismiss()} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>돌아가기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
        maxHeight: '80%',
    },
    recruitInput: {
        height: 40,
        width: '80%', // 너비
        marginTop: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    input: {
        width: '100%',
        marginTop:20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ffffff',
    },
    counterContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    counterButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    counterButtonText: {
        color: 'white',
        fontSize: 18,
    },
    switchContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    dropDown: {
        width: '100%',
        zIndex: 5000,
        position: 'relative',
    },
    dropDownDisabled: {
        backgroundColor: '#e0e0e0',
        opacity: 0.5,
    },
    closeButton: {
        backgroundColor: '#1abc9c',
        padding: 10,
        borderRadius: 8,
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
    },
    updateButton: {
        position: 'absolute',
        right: 40, // 위치 조정
        top: 10,
    },
    deleteButton: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: '800', // 매우 두꺼운 폰트
        color: '#333', // 진한 글씨 색상
        marginBottom: 30,
        textAlign: 'center',
    },
    text: {
        fontSize: 20,
        lineHeight: 32, // 넓은 줄 간격
        marginBottom: 18,
        color: '#555', // 중간 정도의 글씨 색상
    },
});

export default EditStudyPostModal;