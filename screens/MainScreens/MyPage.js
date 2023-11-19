import React, { useState, useCallback } from "react";
import {
    View,
    Modal,
    Text,
    Pressable,
    StyleSheet,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { FAB, Portal, Provider, TextInput } from "react-native-paper";
import { DatePickerModal } from 'react-native-paper-dates';

export default function MyPage() {

    const [selected, setSelected] = useState('');
    const [scheduleModal, setScheduleModal] = useState(false);
    const [studyModal, setStudyModal] = useState(false);
    const [groupStudyModal, setGroupStudyModal] = useState(false);
    const [FABStatus, setFABStatus] = useState(false);
    const [scheduleTitle, setScheduleTitle] = useState('');
    const [studyTitle, setStudyTitle] = useState('');
    const [groupStudyTitle, setGroupStudyTitle] = useState('');
    const [date, setDate] = useState(undefined);
    const [range, setRange] = useState({ startDate: undefined, endDate: undefined});
    const [openSingle, setOpenSingle] = useState(false);
    const [openRange, setOpenRange] = useState(false);

    const renderArrow = (direction) => {
        return (
            <Ionicons
                name={direction === 'left' ? 'arrow-back' : 'arrow-forward'}
                size={24}
                color="grey"
            />
        )
    }

    const onFABStateChange = ({ open }) => setFABStatus(open);

    // registerTranslation('ko', ko);

    const onDismissSingle = useCallback(() => {
        setOpenSingle(false);
    }, [setOpenSingle]);

    const onDismissRange = useCallback(() => {
        setOpenRange(false);
    }, [setOpenRange]);

    const onConfirmSingle = useCallback(
        (params) => {
            setOpenSingle(false);
            setDate(params.date);
        },
        [setOpenSingle, setDate],
        console.log(date)
    );

    const onConfirmRange = useCallback(
        ({startDate, endDate}) => {
            setOpenRange(false);
            setRange({ startDate, endDate });
        },
        [setOpenRange, setRange],
        console.log(range)
    )

    return (
        <Provider>
            <Portal>
                <View style={Styles.container}>
                    <Calendar
                        style={Styles.calendar}
                        renderArrow={renderArrow}
                        onDayPress={(day) => {
                            setSelected(day.dateString);
                            console.log('selected day', day);
                        }}
                        markedDates={{
                            [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                        }}
                    />
                    <Modal
                        animationType="fade"
                        visible={scheduleModal}
                        transparent={true}
                    >
                        <View style={Styles.modalMainView}>
                            <View style={Styles.modalView}>
                                <TextInput
                                    style={Styles.modalInput}
                                    value={scheduleTitle}
                                    placeholder="제목"
                                    textColor="black"
                                    mode="outlined"
                                    onChangeText={scheduleTitle => setScheduleTitle(scheduleTitle)}
                                />
                                <Pressable onPress={() => setOpenSingle(true)}>
                                    <Text style={Styles.modalText}>Select single date</Text>
                                </Pressable>
                                <DatePickerModal
                                    locale='ko'
                                    mode='single'
                                    visible={openSingle}
                                    onDismiss={onDismissSingle}
                                    date={date}
                                    onConfirm={onConfirmSingle}
                                />
                                <Pressable onPress={() => setOpenRange(true)}>
                                    <Text style={Styles.modalText}>Select range date</Text>
                                </Pressable>
                                <DatePickerModal
                                    locale='ko'
                                    mode='range'
                                    visible={openRange}
                                    onDismiss={onDismissRange}
                                    onConfirm={onConfirmRange}
                                    startDate={range.startDate}
                                    endDate={range.endDate}
                                    saveLabel="Save"
                                />
                                <Pressable onPress={() => { setScheduleModal(false) }}>
                                    <Text style={Styles.textStyle}>close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType="fade"
                        visible={studyModal}
                        transparent={true}
                    >
                        <View style={Styles.modalMainView}>
                            <View style={Styles.modalView}>
                                <Text style={Styles.modalText}>StudyModal</Text>
                                <TextInput
                                    value={studyTitle}
                                    placeholder="제목"
                                    mode="outlined"
                                    onChangeText={studyTitle => setStudyTitle(studyTitle)}
                                />
                                <Pressable onPress={() => { setStudyModal(false) }}>
                                    <Text style={Styles.textStyle}>close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType="fade"
                        visible={groupStudyModal}
                        transparent={true}
                    >
                        <View style={Styles.modalMainView}>
                            <View style={Styles.modalView}>
                                <Text style={Styles.modalText}>GroupStudyModal</Text>
                                <TextInput
                                    value={groupStudyTitle}
                                    placeholder="제목"
                                    mode="outlined"
                                    onChangeText={groupStudyTitle => setGroupStudyTitle(groupStudyTitle)}
                                />
                                <Pressable onPress={() => { setGroupStudyModal(false) }}>
                                    <Text style={Styles.textStyle}>close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <FAB.Group
                        open={FABStatus}
                        visible
                        icon={FABStatus ? 'close' : 'plus'}
                        actions={[
                            {
                                icon: 'calendar-edit',
                                label: '개인 일정',
                                onPress: () => { setScheduleModal(true) }
                            },
                            {
                                icon: 'book-open-variant',
                                label: '개인 공부',
                                onPress: () => { setStudyModal(true) }
                            },
                            {
                                icon: 'account-group',
                                label: '스터디 일정',
                                onPress: () => { setGroupStudyModal(true) }
                            }
                        ]}
                        onStateChange={onFABStateChange}
                        onPress={() => {
                            if (FABStatus) {
                                setFABStatus(!open);
                            }
                        }}
                    />
                </View>
            </Portal>
        </Provider>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    calendar: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalMainView: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        marginTop: '60%',
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
        marginBottom: 10,
        backgroundColor: 'white',
        color: 'black'
    },
    modalText: {
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