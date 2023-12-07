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

const formatDate = (date) => {
    if (!date) return '';

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const ScheduleCardModal = ({ visible, onClose, scheduleName, period }) => {

    const [editTitle, setEditTitle] = useState(scheduleName);
    const [editDate, setEditDate] = useState(formatDate(new Date(period)));

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setEditTitle(scheduleName);
        setEditDate(formatDate(new Date(period)));
    }, [scheduleName, period]);

    const parseDate = (dateStr) => { //객체로 변환 : 문자열을 분리하여 객체로
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const handleTitleEdit = (text) => {
        setEditTitle(text);
    };

    const handleClose = () => {
        onClose();
    }

    const handleSave = () => {
        console.log("Saved Title:", editTitle);
        console.log("Saved Date:", editDate);
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
                    <View>
                        <TextInput
                            value={editTitle}
                            onChangeText={handleTitleEdit}
                        />
                        <Button mode='outlined' onPress={() => setOpen(true)}>
                            {editDate}
                        </Button>
                        <DatePickerModal
                            animationType="slide"
                            locale="en"
                            mode="single"
                            visible={open}
                            onDismiss={() => setOpen(false)}
                            date={parseDate(editDate)}
                            presentationStyle='formSheet'
                            onConfirm={(params) => {
                                setOpen(false);
                                setEditDate(formatDate(params.date));
                                console.log(editDate)
                            }}
                        />
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