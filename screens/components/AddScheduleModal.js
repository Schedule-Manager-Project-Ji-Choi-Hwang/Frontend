import React from "react";
import { View, Modal, StyleSheet } from "react-native";

const AddScheduleModal = ({ visible, onClose, scheduleTitle }) => {
    // const [title, setTitle] = useState('');

    const handleClose = () => {
        onClose();
    }

    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
        >
            {/*<View style={Styles.modalMainView}>*/}
            {/*    <View style={Styles.modalView}>*/}
            {/*        <View style={Styles.modalHeader}>*/}
            {/*            <IconButton*/}
            {/*                icon="close"*/}
            {/*                iconColor="grey"*/}
            {/*                size={25}*/}
            {/*                onPress={handleClose}*/}
            {/*            />*/}
            {/*        </View>*/}
            {/*        <View>*/}
            {/*            <TextInput*/}
            {/*                style={Styles.modalInput}*/}
            {/*                value={scheduleTitle}*/}
            {/*                placeholder="일정 제목"*/}
            {/*                textColor="black"*/}
            {/*                mode="outlined"*/}
            {/*                onChangeText={scheduleTitle => setTitle(scheduleTitle)}*/}
            {/*            />*/}
            {/*            <Button*/}
            {/*                style={Styles.contentBtn}*/}
            {/*                labelStyle={{ color: "grey", fontSize: 10 }}*/}
            {/*                mode='outlined'*/}
            {/*                onPress={() => setOpen(true)}*/}
            {/*            >*/}
            {/*                {startDate}*/}
            {/*            </Button>*/}
            {/*            <DatePickerModal*/}
            {/*                animationType="slide"*/}
            {/*                locale="en"*/}
            {/*                mode="single"*/}
            {/*                visible={open}*/}
            {/*                onDismiss={() => setOpen(false)}*/}
            {/*                date={parseDate(editDate)}*/}
            {/*                presentationStyle='formSheet'*/}
            {/*                onConfirm={(params) => {*/}
            {/*                    setOpen(false);*/}
            {/*                    setEditDate(formatDate(params.date));*/}
            {/*                }}*/}
            {/*            />*/}
            {/*            <Text>~</Text>*/}
            {/*            <Button*/}
            {/*                style={Styles.contentBtn}*/}
            {/*                labelStyle={{ color: "grey", fontSize: 10 }}*/}
            {/*                mode='outlined'*/}
            {/*                onPress={() => setOpen(true)}*/}
            {/*            >*/}
            {/*                {endDate}*/}
            {/*            </Button>*/}
            {/*            <DatePickerModal*/}
            {/*                animationType="slide"*/}
            {/*                locale="en"*/}
            {/*                mode="single"*/}
            {/*                visible={open}*/}
            {/*                onDismiss={() => setOpen(false)}*/}
            {/*                date={parseDate(editDate)}*/}
            {/*                presentationStyle='formSheet'*/}
            {/*                onConfirm={(params) => {*/}
            {/*                    setOpen(false);*/}
            {/*                    setEditDate(formatDate(params.date));*/}
            {/*                }}*/}
            {/*            />*/}
            {/*        </View>*/}
            {/*        <Pressable onPress={() => { setScheduleAddModal(false) }}>*/}
            {/*            <Text style={Styles.textStyle}>close</Text>*/}
            {/*        </Pressable>*/}
            {/*    </View>*/}
            {/*</View>*/}
        </Modal >
    )
}

export default AddScheduleModal;

const Styles = StyleSheet.create({
    modalMainView: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        marginTop: '70%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
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
    modalInput: {
        width: '100%',
        height: 30,
        marginBottom: 10,
        backgroundColor: 'white',
        color: 'black'
    },
    datePicker: {
        backgroundColor: 'white'
    },
    addScheduleBtn: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 15,
        textAlign: 'center',
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    datePicker: {
        width: '60%',

    }
})