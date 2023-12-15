import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {Button, Card, IconButton, Menu, TextInput} from 'react-native-paper';
import axios from 'axios'; // axios 라이브러리 사용
import Config from '../../config/config';
import AsyncStorage from "@react-native-async-storage/async-storage"; // Config 파일 또는 필요한 설정

const AnnouncementDetailModal = ({ visible, onDismiss, announcement, studyPostId }) => {
    const [announcementData, setAnnouncementData] = useState({});
    const [commentData, setCommentData] = useState([]);
    const [newComment, setNewComment] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState("");


    useEffect(() => {
        if (visible) {
            const fetchData = async () => {
                try {
                    await fetchAnnouncementData();
                } catch (error) {
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [visible, studyPostId]);


    const submitComment = async () => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            await axios.post(`${Config.MY_IP}:8080/study-board/${studyPostId}/study-announcements/${announcement.announcementId}/comment/add`,
                { comment: newComment },
                { headers: { Authorization: token } }
            );

            setNewComment(""); // 입력 필드 초기화
            fetchAnnouncementData(); // 댓글 목록 새로고침
        } catch (error) {
            console.error(error);
        }
    };

    // 댓글 수정 함수
    const submitEditComment = async (commentId) => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            await axios.patch(`${Config.MY_IP}:8080/study-board/study-announcements/${announcement.announcementId}/comment/${editingCommentId}/edit`,
                { comment: editedComment },
                { headers: { Authorization: token } }
            );
            // 댓글 목록 새로고침
            fetchAnnouncementData();
            // 수정 상태 종료
            setIsEditing(false);
            setEditingCommentId(null);
        } catch (error) {
            console.error(error);
        }
    };

    // 댓글 삭제 함수
    const deleteComment = async (commentId) => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            await axios.delete(`${Config.MY_IP}:8080/study-announcements/${announcement.announcementId}/comment/${commentId}/delete`, {
                headers: { Authorization: token }
            });
            // 댓글 목록 새로고침
            fetchAnnouncementData();
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAnnouncementData = async () => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            const response = await axios.get(`${Config.MY_IP}:8080/study-board/${studyPostId}/study-announcements/${announcement.announcementId}`, {
                headers: { Authorization: token }
            });

            if (response.status === 200) {
                setAnnouncementData({
                    announcementId : response.data.data.announcementId,
                    announcementTitle : response.data.data.announcementTitle,
                    announcementPost : response.data.data.announcementPost,
                    announcementCreateDate : response.data.data.createDate
                });
                if (response.data.data.commentList.length === 0) {
                    setCommentData([]);
                } else {
                    setCommentData(response.data.data.commentList);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal visible={visible} onDismiss={onDismiss} transparent animationType="slide" style={{zIndex: 1500}}>
            <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
                    <IconButton icon="close" />
                </TouchableOpacity>
                {announcementData.announcementTitle && (
                    <>
                        <Text style={styles.title}>{announcementData.announcementTitle}</Text>
                        <View style={styles.separator} />
                        <Text style={styles.createDate}>{announcementData.announcementCreateDate}</Text>
                        <View style={styles.announcementBox}>
                            <Text style={styles.content}>{announcementData.announcementPost}</Text>
                        </View>
                        <View style={styles.commentForm}>
                            <TextInput
                                style={styles.input}
                                placeholder="댓글을 입력해 주세요."
                                value={newComment}
                                onChangeText={setNewComment}
                            />
                            <Button onPress={submitComment} style={styles.submitButton} labelStyle={styles.submitButtonText}>등록</Button>
                        </View>
                        <ScrollView style={styles.commentsContainer}>
                            {commentData.map((comment) => (
                                <View key={comment.commentId} style={styles.comment}>
                                    <View style={styles.commentRow}>
                                        <View style={styles.commentTextContainer}>
                                            <Text style={styles.commentAuthor}>{comment.nickname}</Text>
                                            <Text style={styles.commentCreateDate}>{comment.lastModifiedDate}</Text>
                                            <Text style={styles.commentText}>{comment.comment}</Text>
                                        </View>

                                        {/* Edit 및 Delete 버튼 추가 */}
                                        <View style={styles.commentActionButtons}>
                                            <Button
                                                onPress={() => {
                                                    setIsEditing(true);
                                                    setEditingCommentId(comment.commentId);
                                                    setEditedComment(comment.comment);
                                                }}
                                            >Edit</Button>
                                            <Button
                                                onPress={() => deleteComment(comment.commentId)}
                                            >Delete</Button>
                                        </View>
                                    </View>
                                    {/* 특정 댓글 바로 아래에 댓글 수정 폼 표시 */}
                                    {isEditing && editingCommentId === comment.commentId && (
                                        <View style={styles.editCommentForm}>
                                            <TextInput
                                                style={styles.input}
                                                value={editedComment}
                                                onChangeText={setEditedComment}
                                            />
                                            <Button
                                                onPress={() => submitEditComment(comment.commentId)}
                                            >
                                                Update Comment
                                            </Button>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </ScrollView>
                    </>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    separator: {
        borderBottomColor: '#e0e0e0', // 선의 색상 지정
        borderBottomWidth: 1,         // 선의 두께 지정
        marginVertical: 8,            // 위아래 여백 지정
        width: '100%',                // 뷰의 너비를 100%로 설정
    },
    modalContainer: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        maxHeight: '90%', // 모달의 최대 높이를 화면 높이의 80%로 제한
        // opacity: 0.5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    announcementBox: {
        width: '100%',
        marginTop: 10,
        backgroundColor: '#f2f2f2', // 박스의 배경색
        borderRadius: 3, // 모서리 둥글기
        padding: 15, // 내부 여백
        shadowColor: '#000', // 그림자 색상
        shadowOffset: { width: 0, height: 1 }, // 그림자 위치
        shadowOpacity: 0.2, // 그림자 투명도
        shadowRadius: 1.41, // 그림자 둥글기
        elevation: 2, // 안드로이드에서의 그림자
        marginBottom: 15, // 아래쪽 여백
    },
    content: {
        fontSize: 16,
        color: '#333',
    },
    createDate: {
        alignSelf: 'flex-end', // 오른쪽 정렬
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    commentsContainer: {
        // maxHeight: 500, // ScrollView의 최대 높이 설정
        width: '100%',
        // flex: 1,
        // height: '300'

        // 기타 필요한 스타일
    },
    comment: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        position: 'relative', // 상대적 위치 설정
    },
    commentActionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    commentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // 아이템들을 양 끝으로 정렬
        alignItems: 'center', // 아이템들을 세로 방향으로 중앙 정렬
    },
    commentContentContainer: {
        flexDirection: 'row', // 수평 방향으로 배열
        alignItems: 'center', // 세로 중앙 정렬
    },
    commentTextContainer: {
        flex: 1, // 대부분의 공간을 차지
    },
    commentAuthor: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    commentCreateDate: {
        position: 'absolute', // 절대적 위치 설정
        top: 10, // 상단에서 10의 여백
        right: 10, // 우측에서 10의 여백
        fontSize: 12,
        color: '#666',
    },
    commentText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    commentForm: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center', // 수평 방향으로 가운데 정렬
        alignItems: 'center', // 수직 방향으로 가운데 정렬
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        backgroundColor: '#ffffff',
        // borderRadius: 20,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginRight: 10,
        height: 50, // 높이 설정
        color: '#333333', // 텍스트 색상
    },
    submitButton: {
        backgroundColor: '#4CAF50', // 버튼의 배경색
        borderRadius: 10, // 모서리 둥글기
        height: 70,
        width: '10%',
        justifyContent: 'center', // 버튼 내부 텍스트를 중앙에 위치
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        shadowOpacity: 0.25,
        elevation: 2,
    },
    submitButtonText: {
        color: '#ffffff', // 버튼 텍스트 색상
        fontSize: 15,
    },

});


export default AnnouncementDetailModal;

