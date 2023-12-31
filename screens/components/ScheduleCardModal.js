import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Modal, Alert, StyleSheet } from "react-native";
import { Button, TextInput, IconButton, } from "react-native-paper";
import { DatePickerModal } from 'react-native-paper-dates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from "../../config/config";

const formatDate = (date) => {
    if (!date) return '';

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const ScheduleCardModal = ({ visible, onClose, scheduleName, period,
    scheduleId, subjectId, isPersonal, onScheduleEdit }) => {

    const [editTitle, setEditTitle] = useState(scheduleName);
    const [editDate, setEditDate] = useState(formatDate(new Date(period)));
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setEditTitle(scheduleName);
        setEditDate(formatDate(new Date(period)));
    }, [scheduleName, period]);

    const updateSchedule = async (scheduleId, subjectId, isPersonal) => {
        try {
            if (isPersonal === true) {
                const token = await AsyncStorage.getItem('AccessToken');
                if (!token) {
                    console.log('No access token');
                    return null;
                }
                const response = await axios.patch(`${Config.MY_IP}:8080/subjects/${subjectId}/schedules/${scheduleId}/edit`, {
                    scheduleName: editTitle,
                    period: editDate
                }, {
                    headers: { Authorization: token }
                });
                return response;
            } else {
                const token = await AsyncStorage.getItem('AccessToken');
                if (!token) {
                    console.log('No access token');
                    return null;
                }
                const response = await axios.patch(`${Config.MY_IP}:8080/study-board/${subjectId}/study-schedule/${scheduleId}/edit`, {
                    scheduleName: editTitle,
                    period: editDate
                }, {
                    headers: { Authorization: token }
                });
                return response;
            }
        } catch (error) {
            console.error('Error patching data: ', error);
        }
    }

    const deleteSchedule = async (scheduleId, subjectId, isPersonal) => {
        try {
            if (isPersonal === true) {
                const token = await AsyncStorage.getItem('AccessToken');
                if (!token) {
                    console.log('No access token');
                    return null;
                }
                const response = await axios.delete(`${Config.MY_IP}:8080/subjects/${subjectId}/schedules/${scheduleId}/delete`, {
                    headers: { Authorization: token }
                });
                return response;
            } else {
                const token = await AsyncStorage.getItem('AccessToken');
                if (!token) {
                    console.log('No access token');
                    return null;
                }
                const response = await axios.delete(`${Config.MY_IP}:8080/study-board/${subjectId}/study-schedule/${scheduleId}/delete`, {
                    headers: { Authorization: token }
                });
                return response;
            }
        } catch (error) {
            console.error('Error patching data: ', error);
        }
    }

    const parseDate = (date) => {
        const [year, month, day] = date.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const handleTitleEdit = (text) => {
        setEditTitle(text);
    };

    const handleClose = () => {
        setEditTitle(scheduleName);
        setEditDate(formatDate(new Date(period)));
        onClose();
    }

    const handleSave = async () => {
        if (editTitle.trim() === '') {
            Alert.alert("경고", "일정 제목을 다시 입력해주세요.");
            return;
        }
        const data = await updateSchedule(scheduleId, subjectId, isPersonal);
        if (data) {
            onScheduleEdit();
        }
        onClose();
    }

    const handleDelete = async () => {
        const data = await deleteSchedule(scheduleId, subjectId, isPersonal);
        if (data) {
            onScheduleEdit();
        }
        onClose();
    }

    return (
        <Modal
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
            transparent={true}
        >
            <View style={Styles.MainModalView}>
                <View style={Styles.modalView}>
                    <View style={Styles.modalHeader}>
                        <IconButton
                            icon="close"
                            iconColor="grey"
                            size={25}
                            onPress={handleClose}
                        />
                    </View>
                    <View style={Styles.modalContent}>
                        <TextInput
                            mode='outlined'
                            value={editTitle}
                            onChangeText={handleTitleEdit}
                        />
                        <Button
                            style={Styles.contentBtn}
                            labelStyle={{ color: "grey", fontSize: 20 }}
                            mode='outlined'
                            onPress={() => setOpen(true)}
                        >
                            {editDate}
                        </Button>
                        <DatePickerModal
                            animationType="slide"
                            locale="en"
                            mode="single"
                            visible={open}
                            onDismiss={() => setOpen(false)}
                            date={parseDate(editDate)}
                            onConfirm={(params) => {
                                setOpen(false);
                                setEditDate(formatDate(params.date));
                            }}
                        />
                    </View>
                    <View style={Styles.modalFooter}>
                        <Button
                            style={{ flex: 1 }}
                            mode='contained'
                            onPress={handleSave}
                        >
                            Save</Button>
                        <Button
                            style={{ flex: 1 }}
                            mode='contained'
                            onPress={handleDelete}
                        >
                            Delete</Button>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ScheduleCardModal;

const Styles = StyleSheet.create({
    MainModalView: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        marginTop: '70%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        alignItems: "flex-end",
    },
    modalContent: {
    },
    contentBtn: {
        marginTop: 5
    },
    modalFooter: {
        margin: 5,
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "stretch"
    }
})