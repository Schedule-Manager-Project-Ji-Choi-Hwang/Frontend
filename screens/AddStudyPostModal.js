import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Switch, Text, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Config from "../config/config";
import DropDownPicker from "react-native-dropdown-picker";

const AddStudyPostModal = ({isVisible, setAddState, setPosts, setLastPostId, fetchPosts, closeModal}) => {
    const [studyName, setStudyName] = useState('');
    const [tag, setTag] = useState();
    const [recruitMember, setRecruitMember] = useState('');
    const [onOff, setOnOff] = useState(false);
    const [area, setArea] = useState('');
    const [post, setPost] = useState('');

    const [openTagDropDown, setOpenTagDropDown] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);

    const [openAreaDropDown, setOpenAreaDropDown] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);

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

    const resetForm = () => { // .
        setStudyName('');
        setTag(undefined);
        setRecruitMember('');
        setOnOff(false);
        setArea('');
        setPost('');
        setSelectedTag(null);
        setSelectedArea(null);
    };

    const handleAddPost = async () => {
        try {
            let defaultArea;
            if (onOff) {
                defaultArea = "온라인";
            } else {
                defaultArea = selectedArea;
            }

            const postData = {
                studyName: studyName,
                tag: selectedTag,
                recruitMember: recruitMember,
                onOff: onOff,
                area: defaultArea,
                post: post
            };
            console.log(postData);
            const token = await AsyncStorage.getItem('AccessToken');
            await axios.post(`${Config.MY_IP}:8080/study-board/post`, postData,
                {headers: {Authorization: token}}
            );

            resetForm();
            closeModal();
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    const handlePost = async () => {
        await handleAddPost();
        setPosts();
        setLastPostId();
        setAddState();
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.outerContainer}>
                <View style={styles.modalView}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {closeModal(); resetForm();}}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="스터디 이름"
                        value={studyName}
                        onChangeText={setStudyName}
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
                            style={styles.input}
                            placeholder="모집 인원(2~20명)"
                            value={recruitMember}
                            onChangeText={setRecruitMember}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity
                            style={styles.counterButton}
                            onPress={() => setRecruitMember(Math.max(2, recruitMember - 1))}>
                            <Text style={styles.counterButtonText}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.counterButton}
                            onPress={() => setRecruitMember(Math.min(20, recruitMember + 1))}>
                            <Text style={styles.counterButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.switchContainer}>
                        <Text>Offline/Online: </Text>
                        <Switch
                            value={onOff}
                            onValueChange={setOnOff}
                        />
                    </View>
                    <DropDownPicker
                        style={[
                            styles.dropDown,
                            { zIndex: openAreaDropDown ? 5000 : 1, position: 'relative' },
                            onOff ? styles.dropDownDisabled : {} // 비활성화 스타일 추가
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
                        disabled={onOff}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="글을 작성해 주세요."
                        value={post}
                        onChangeText={setPost}
                        multiline
                    />
                    <TouchableOpacity style={styles.button} onPress={handlePost}>
                        <Text style={styles.buttonText}>등록</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    },
    modalView: {
        width: '90%', // 모달 너비
        backgroundColor: "white",
        borderRadius: 10, // 모서리 둥글기
        paddingTop:40,
        padding: 20, // 내부 여백
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        height: 40,
        width: '100%', // 너비
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
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%', // 너비
        marginBottom: 15,
    },
    counterButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    counterButtonText: {
        fontSize: 18,
        color: 'white',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%', // 너비
        marginBottom: 15,
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: '#ccc',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#333',
        fontSize: 16,
    },
    dropDown: {
        width: '100%', // 너비
        marginBottom: 15,
        zIndex: 1,
    },
    dropDownDisabled: {
        backgroundColor: '#e0e0e0',
        color: '#a0a0a0',
        opacity: 0.5,
    }, //
    // counterContainer: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     // 추가적인 스타일링...
    // },
    // counterButton: {
    //     padding: 10,
    //     backgroundColor: '#ddd',
    //     // 추가적인 스타일링...
    // },
    // counterButtonText: {
    //     fontSize: 18,
    //     // 추가적인 스타일링...
    // },
    counterValue: {
        marginHorizontal: 10,
        fontSize: 18,
        // 추가적인 스타일링...
    },
    // dropDownDisabled: {
    //     backgroundColor: '#e0e0e0', // 비활성화 상태의 배경색
    //     color: '#a0a0a0', // 비활성화 상태의 텍스트 색상
    //     opacity: 0.5, // 투명도 조정
    // },
    // dropDown: {
    //     marginTop: 5
    // },
    inputActive: {
        // 활성화 상태 스타일
    },
    inputInactive: {
        // 비활성화 상태 스타일
        backgroundColor: '#e1e1e1', // 희미한 배경색
        borderColor: '#aaa', // 희미한 테두리 색상
        color: '#aaa', // 희미한 텍스트 색상
    },
    // closeButton: {
    //     position: 'absolute',
    //     right: 10,
    //     top: 10,
    //     backgroundColor: '#ccc', // 버튼 배경색
    //     borderRadius: 15,
    //     width: 30,
    //     height: 30,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    // closeButtonText: {
    //     color: '#333', // 텍스트 색상
    //     fontSize: 16, // 텍스트 크기
    // },
    // outerContainer: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    // },
    // modalView: {
    //     width: '80%',
    //     margin: 20,
    //     backgroundColor: "white",
    //     borderRadius: 20,
    //     padding: 35,
    //     alignItems: "center",
    //     shadowColor: "#000",
    //     shadowOffset: {
    //         width: 0,
    //         height: 2
    //     },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 4,
    //     elevation: 5
    // },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5', // 배경색 설정
        borderRadius: 10, // 모서리 둥글게
        borderWidth: 1,
        borderColor: '#e1e1e1', // 테두리 색상 및 두께
        shadowColor: '#000', // 그림자 색
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    // input: {
    //     height: 40,
    //     marginBottom: 12,
    //     borderWidth: 1,
    //     borderColor: '#007bff', // 입력 필드 테두리 색상
    //     padding: 10,
    //     borderRadius: 5, // 입력 필드 모서리 둥글게
    //     backgroundColor: '#ffffff', // 입력 필드 배경색
    //     shadowColor: '#000', // 입력 필드 그림자 색
    //     shadowOffset: { width: 0, height: 1 },
    //     shadowOpacity: 0.22,
    //     shadowRadius: 2.22,
    //     elevation: 3,
    // },
    // switchContainer: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: 12,
    // },
    // button: {
    //     backgroundColor: '#007bff', // 버튼 색상
    //     padding: 12,
    //     borderRadius: 8, // 버튼 모서리 둥글게
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     width: '100%', // 너비 조정
    //     marginTop: 10, // 마진 상단 추가
    // },
    // buttonText: {
    //     color: 'white', // 버튼 텍스트 색상
    //     fontSize: 16, // 텍스트 크기
    // },
});


export default AddStudyPostModal;
