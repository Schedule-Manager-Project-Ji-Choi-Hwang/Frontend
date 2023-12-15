import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Modal, StyleSheet } from "react-native";
import { Button, TextInput, IconButton, Portal, Provider, SegmentedButtons } from "react-native-paper";
import { DatePickerModal } from 'react-native-paper-dates';
import DropDownPicker from "react-native-dropdown-picker";
import Config from "../../config/config";

const AddScheduleModal = ({ visible, onClose, scheduleTitle, isPersonal, placeholder }) => {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState("시작 날짜");
    const [endDate, setEndDate] = useState("종료 날짜");
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
    const [period, setPeriod] = useState("");
    const [openList, setOpenList] = useState(false);
    const [select, setSelect] = useState(null);
    const [items, setItems] = useState([]);
    const [openDropDown, setOpenDropDown] = useState(false);

    const handleClose = () => {
        onClose();
        setSelect(null);
        setTitle('');
        setPeriod("");
        setStartDate("시작 날짜");
        setEndDate("종료 날짜");
    }

    const handleAdd = () => {
        console.log("Add Schedule");
        // let dataToSend = {
        //     "scheduleName" : title,
        //     "repeat" : period,

        // }
    }

    const handleStartDateConfirm = (params) => {
        setOpenStartDatePicker(false);
        const formattedDate = formatDate(params.date);
        setStartDate(formattedDate);
    }

    const handleEndDateConfirm = (params) => {
        setOpenEndDatePicker(false);
        const formattedDate = formatDate(params.date);
        setEndDate(formattedDate);
    }

    const parseDate = (date) => {
        if (date && date.includes('-')) {
            const [year, month, day] = date.split('-').map(Number);
            return new Date(year, month - 1, day);
        }
        return new Date();
    };

    const formatDate = (date) => {
        if (!date) return '';

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const subjectData = (data) => {
        const formattedItems = data.map(subject => ({
            label: subject.subjectName,
            value: subject.subjectId
        }));
        setItems(formattedItems);
    }

    const groupStudyData = (data) => {
        const formattedItems = data.map(study => ({
            label: study.studyPostName,
            value: study.studyPostId
        }));
        setItems(formattedItems);
    }

    const fetchDataList = async () => {
        if (!openDropDown) return;
        try {
            if (isPersonal === true) {
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
            } else {
                const token = await AsyncStorage.getItem('AccessToken');
                if (!token) {
                    console.log('No access token');
                    return null;
                }
                const response = await axios.get(`${Config.MY_IP}:8080/my-study-board/name-list`, {
                    headers: { Authorization: token }
                });

                if (response && response.data) {
                    groupStudyData(response.data.data);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchDataList();
    }, [openDropDown]);

    return (
        <Provider>
            <Portal>
                <Modal
                    animationType="fade"
                    visible={visible}
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
                                    style={Styles.modalInput}
                                    value={scheduleTitle}
                                    placeholder="일정 제목"
                                    textColor="black"
                                    mode="outlined"
                                    onChangeText={scheduleTitle => setTitle(scheduleTitle)}
                                />
                                <View style={Styles.contentDate}>
                                    <Button
                                        style={Styles.contentBtn}
                                        labelStyle={{ color: "grey", fontSize: 15 }}
                                        mode='outlined'
                                        onPress={() => setOpenStartDatePicker(true)}
                                    // onPress={() => console.log("setStartDate")}
                                    >
                                        {startDate}
                                    </Button>
                                    <DatePickerModal
                                        animationType="slide"
                                        locale="en"
                                        mode="single"
                                        visible={openStartDatePicker}
                                        onDismiss={() => setOpenStartDatePicker(false)}
                                        date={parseDate(startDate)}
                                        onConfirm={handleStartDateConfirm}
                                    />
                                    <Text style={{ fontSize: 15, marginTop: 12, padding: 3 }}>~</Text>
                                    <Button
                                        style={Styles.contentBtn}
                                        labelStyle={{ color: "grey", fontSize: 15 }}
                                        mode='outlined'
                                        onPress={() => setOpenEndDatePicker(true)}
                                    // onPress={() => console.log("setEndDate")}
                                    >
                                        {endDate}
                                    </Button>
                                    <DatePickerModal
                                        animationType="slide"
                                        locale="en"
                                        mode="single"
                                        visible={openEndDatePicker}
                                        onDismiss={() => setOpenEndDatePicker(false)}
                                        date={parseDate(endDate)}
                                        onConfirm={handleEndDateConfirm}
                                    />
                                </View>
                                <SegmentedButtons
                                    style={{ marginTop: 5 }}
                                    value={period}
                                    onValueChange={setPeriod}
                                    buttons={[
                                        {
                                            value: 'DAILY',
                                            label: '매일',
                                        },
                                        {
                                            value: 'WEEKLY',
                                            label: '매주',
                                        },
                                        {
                                            value: 'MONTHLY',
                                            label: '매월'
                                        },
                                    ]}
                                />
                                <View>
                                    <DropDownPicker
                                        style={Styles.dropDown}
                                        theme="LIGHT"
                                        open={openDropDown}
                                        setOpen={setOpenDropDown}
                                        items={items}
                                        setItems={setItems}
                                        value={select}
                                        setValue={setSelect}
                                        placeholder={placeholder}
                                        autoScroll={true}
                                    />
                                </View>
                            </View>
                            <View style={Styles.modalFooter}>
                                <Button
                                    style={{ flex: 1, zIndex: 1 }}
                                    mode='contained'
                                    onPress={handleAdd}
                                >
                                    Add</Button>
                            </View>
                        </View>
                    </View>
                </Modal >
            </Portal>
        </Provider>
    )
}

export default AddScheduleModal;

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
        zIndex: 1000
    },
    contentDate: {
        justifyContent: "space-around",
        flexDirection: "row"
    },
    contentBtn: {
        marginTop: 5,
        alignItems: "stretch"
    },
    dropDown: {
        marginTop: 5,
    },
    modalFooter: {
        margin: 5,
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "stretch"
    }
})