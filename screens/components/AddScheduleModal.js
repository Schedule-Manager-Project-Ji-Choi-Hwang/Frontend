import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Modal, StyleSheet } from "react-native";
import { Button, TextInput, IconButton, Portal, Provider, RadioButton, SegmentedButtons, Divider } from "react-native-paper";
import { DatePickerModal } from 'react-native-paper-dates';
import DropDownPicker from "react-native-dropdown-picker";
import Config from "../../config/config";
import { useNavigation } from "@react-navigation/native";

const AddScheduleModal = ({ visible, onClose, scheduleTitle, isPersonal, placeholder, onScheduleEdit }) => {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
    const [repeat, setRepeat] = useState("");
    const [openList, setOpenList] = useState(false);
    const [select, setSelect] = useState(null);
    const [items, setItems] = useState([]);
    // const [subjectItems, setSubjectItems] = useState([]);
    // const [studyItems, setStudyItems] = useState([])
    const [openDropDown, setOpenDropDown] = useState(false);

    const [scheduleType, setScheduleType] = useState('single'); // 'single' 또는 'range'
    const navigation = useNavigation();

    const renderScheduleOptions = () => {
        if (scheduleType === 'single') {
            return (
                <Button
                    onPress={() => setOpenStartDatePicker(true)}>
                    {formatDate(startDate)}
                </Button>
            );
        } else {
            return (
                <View>
                    <Button
                        onPress={() => setOpenStartDatePicker(true)}>
                        {formatDate(startDate)}
                    </Button>
                    <Text>~</Text>
                    <Button
                        onPress={() => setOpenEndDatePicker(true)}>
                        {formatDate(endDate)}
                    </Button>
                    <SegmentedButtons
                        value={repeat}
                        onValueChange={setRepeat}
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
                </View>
            );
        }
    };

    const handleClose = () => {
        setSelect(null);
        setTitle('');
        setRepeat("");
        setStartDate(new Date());
        setEndDate(new Date());
        onClose();
    }


    const handleAdd = async () => {
        let dataToSend;
        if (isPersonal === true) {
            if (scheduleType === "single") {
                dataToSend = {
                    scheduleName: title,
                    period: formatDate(startDate)
                };
            } else {
                dataToSend = {
                    scheduleName: title,
                    startDate: formatDate(startDate),
                    endDate: formatDate(endDate),
                    repeat: repeat
                }
            }
        } else {
            if (scheduleType === "single") {
                dataToSend = {
                    studyScheduleName: title,
                    period: formatDate(startDate)
                };
            } else {
                dataToSend = {
                    studyScheduleName: title,
                    startDate: formatDate(startDate),
                    endDate: formatDate(endDate),
                    repeat: repeat
                };
            }
        }

        try {
            const token = await AsyncStorage.getItem('AccessToken');
            if (!token) {
                console.log('No access token');
                return null;
            }

            if (isPersonal === true) {
                await axios.post(`${Config.MY_IP}:8080/subjects/${select}/schedules/add`, dataToSend, {
                    headers: { Authorization: token }
                });
                onScheduleEdit();
                handleClose();
            } else {
                await axios.post(`${Config.MY_IP}:8080/study-board/${select}/study-schedule/add`, dataToSend, {
                    headers: { Authorization: token }
                });
                onScheduleEdit();
                handleClose();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleStartDateConfirm = (params) => {
        setOpenStartDatePicker(false);
        setStartDate(params.date);
    }

    const handleEndDateConfirm = (params) => {
        setOpenEndDatePicker(false);
        setEndDate(params.date);
    }

    const formatDate = (date) => {
        if (!(date instanceof Date)) return '';

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const subjectData = (data) => {
        const formattedItems = data.map(subject => ({
            label: subject.subjectName,
            value: subject.subjectId,
            icon: () => (
                <View
                    style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: subject.color,
                        marginRight: 10
                    }} />
            )
        }));
        console.log("subjectData : ", formattedItems);
        setItems(formattedItems);
    }

    const groupStudyData = (data) => {
        const formattedItems = data.map(study => ({
            label: study.studyPostName,
            value: study.studyPostId
        }));
        console.log("groupStudyData : ", formattedItems);
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

    useEffect(() => {
        setTitle(scheduleTitle);
    }, [scheduleTitle]);

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
                                    value={title}
                                    placeholder="일정 제목"
                                    onChangeText={title => setTitle(title)}
                                />
                                <Divider
                                    style={Styles.divider}
                                    horizontalInset={true}
                                />
                                <RadioButton.Group
                                    onValueChange={newValue => setScheduleType(newValue)}
                                    value={scheduleType}>
                                    <View style={Styles.radioButtonContainer}>
                                        <RadioButton value="single" />
                                        <Text>단일 일정</Text>
                                        <RadioButton value="range" />
                                        <Text>범위 일정</Text>
                                    </View>
                                </RadioButton.Group>
                                {renderScheduleOptions()}
                                <DatePickerModal
                                    animationType="slide"
                                    locale="en"
                                    mode="single"
                                    visible={openStartDatePicker}
                                    onDismiss={() => setOpenStartDatePicker(false)}
                                    date={startDate}
                                    onConfirm={handleStartDateConfirm}
                                />

                                <DatePickerModal
                                    animationType="slide"
                                    locale="en"
                                    mode="single"
                                    visible={openEndDatePicker}
                                    onDismiss={() => setOpenEndDatePicker(false)}
                                    date={endDate}
                                    onConfirm={handleEndDateConfirm}
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
                            <Divider
                                style={Styles.divider}
                                horizontalInset={true}
                            />
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
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
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
    divider: {
        backgroundColor: "black",
        marginTop: 5
    },
    modalFooter: {
        margin: 5,
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "stretch"
    }
})