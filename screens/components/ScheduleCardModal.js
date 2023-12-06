import React, { useState, useEffect } from 'react';
import {
    View,
    Modal,
    StyleSheet
} from "react-native";
import {
    Button,
    TextInput,
    IconButton,
} from "react-native-paper";
import { DatePickerModal } from 'react-native-paper-dates';

const ScheduleCardModal = ({ visible, onClose, scheduleName, period }) => {
    const [editTitle, setEditTitle] = useState(scheduleName);
    const [editDate, setEditDate] = useState();

    // const [date, setDate] = useState(undefined);
    // const [open, setOpen] = useState(false);

    // const onDismissSingle = React.useCallback(() => {
    //     setOpen(false);
    // }, [setOpen]);

    // const onConfirmSingle = React.useCallback(
    //     (params) => {
    //         setOpen(false);
    //         setDate(params.date);
    //     },
    //     [setOpen, setDate]
    // );

    useEffect(() => {
        setEditTitle(scheduleName);
        setEditDate(period);
    }, [scheduleName, period]);

    const handleTitleEdit = (text) => {
        setEditTitle(text);
    };

    const handleClose = () => {
        setEditTitle(scheduleName);
        setEditDate(period);
        console.log("Close")
        onClose();
    }

    const handleSave = () => {
        console.log("Save");
        onClose();
    }

    // const changeDate = () => {
    //     return (
    //         <DatePickerModal
    //             locale="en"
    //             mode="single"
    //             visible={open}
    //             onDismiss={onDismissSingle}
    //             date={date}
    //             onConfirm={onConfirmSingle}
    //         />
    //     )
    // }

    // 함수 선언 : 세이브 버튼 누를 때만 내용 모달창의 내용이 유지되도록 X 누르면 초기화

    // save 한 후 화면 리다이렉트

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
                    <View>
                        <TextInput
                            value={editTitle}
                            onChangeText={handleTitleEdit}
                        />
                        <Button mode='outlined' title="Open" onPress={() => console.log("change-date")}>{period}</Button>
                    </View>
                    <Button mode='contained' onPress={handleSave}>Save</Button>
                    <Button mode='contained' onPress={() => console.log("Delete")}>Delete</Button>
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
        padding: 20,
        alignItems: 'center',
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
        flexDirection: "row",
        alignItems: "flex-end",
    }
})