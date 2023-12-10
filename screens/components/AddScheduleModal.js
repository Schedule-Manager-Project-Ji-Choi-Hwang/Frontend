import React, { useState } from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import { Button, TextInput, IconButton, Portal, Provider, SegmentedButtons } from "react-native-paper";
import { DatePickerModal } from 'react-native-paper-dates';
import DropDownPicker from "react-native-dropdown-picker";

const AddScheduleModal = ({ visible, onClose, scheduleTitle }) => {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState("시작 날짜");
    const [endDate, setEndDate] = useState("종료 날짜");
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
    const [openDropDown, setOpenDropDown] = useState(false);
    const [period, setPeriod] = useState("");
    const [openList, setOpenList] = useState(false);
    const [selectSubject, setSelectSubject] = useState("");
    const [items, setItems] = useState([
        {label: 'subejct 1', value: 'subejct 1'},
        {label: 'subejct 2', value: 'subejct 2'},
        {label: 'subejct 3', value: 'subejct 3'},
    ]);

    const handleClose = () => {
        onClose();
    }

    const handleAdd = () => {
        console.log("Add Schedule");
    }

    const parseDate = (date) => {
        const [year, month, day] = date.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const formatDate = (date) => {
        if (!date) return '';

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

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
                                        // onPress={() => setOpenStartDatePicker(true)}
                                        onPress={() => console.log("setStartDate")}
                                    >
                                        {startDate}
                                    </Button>
                                    {/* <DatePickerModal
                                animationType="slide"
                                locale="en"
                                mode="single"
                                visible={openStartDatePicker}
                                onDismiss={() => setOpenStartDatePicker(false)}
                                date={parseDate(startDate)}
                                // presentationStyle='formSheet'
                                onConfirm={(params) => {
                                    setOpenStartDatePicker(false);
                                    // setStartDate(formatDate(params.date));
                                    setStartDate(params.date);
                                }}
                            /> */}
                                    <Text style={{ fontSize: 15, marginTop: 12, padding: 3 }}>~</Text>
                                    <Button
                                        style={Styles.contentBtn}
                                        labelStyle={{ color: "grey", fontSize: 15 }}
                                        mode='outlined'
                                        // onPress={() => setOpenEndDatePicker(true)}
                                        onPress={() => console.log("setEndDate")}
                                    >
                                        {endDate}
                                    </Button>
                                    {/* <DatePickerModal
                                animationType="slide"
                                locale="en"
                                mode="single"
                                visible={openEndDatePicker}
                                onDismiss={() => setOpenEndDatePicker(false)}
                                date={parseDate(endDate)}
                                // presentationStyle='formSheet'
                                onConfirm={(params) => {
                                    setOpenEndDatePicker(false);
                                    // setEndDate(formatDate(params.date));
                                    setEndDate(params.date);
                                }}
                            /> */}
                                </View>
                                <SegmentedButtons
                                    style={{ marginTop: 5 }}
                                    value={period}
                                    onValueChange={setPeriod}
                                    buttons={[
                                        {
                                            value: '1',
                                            label: '매일',
                                        },
                                        {
                                            value: '2',
                                            label: '매주',
                                        },
                                        {
                                            value: '3',
                                            label: '매월'
                                        },
                                    ]}
                                />
                                <DropDownPicker
                                    open={openList}
                                    value={selectSubject}
                                    items={items}
                                    // setOpen={setOpen}
                                    // setValue={setValue}
                                    setItems={setItems}
                                    placeholder={'Choose a fruit.'}
                                />
                            </View>
                            <View style={Styles.modalFooter}>
                                <Button
                                    style={{ flex: 1 }}
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
    },
    contentDate: {
        justifyContent: "space-around",
        flexDirection: "row"
    },
    contentBtn: {
        marginTop: 5,
        alignItems: "stretch"
    },
    modalFooter: {
        margin: 5,
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "stretch"
    }
})