import React, { useState, useCallback } from "react";
import {
    View,
    Modal,
    Text,
    Pressable,
    StyleSheet,
} from "react-native";
import { CalendarList } from "react-native-calendars";
import { Button, FAB, Portal, Provider, TextInput, RadioButton, Card } from "react-native-paper";
import { DatePickerModal, registerTranslation } from 'react-native-paper-dates';

export default function MyPage() {

    const today = new Date();

    const [selected, setSelected] = useState('');
    const [scheduleCardModal, setScheduleCardModal] = useState(false);
    const [scheduleAddModal, setScheduleAddModal] = useState(false);
    const [groupStudyModal, setGroupStudyModal] = useState(false);
    const [FABStatus, setFABStatus] = useState(false);
    const [scheduleTitle, setScheduleTitle] = useState('');
    const [studyTitle, setStudyTitle] = useState('');
    const [groupStudyTitle, setGroupStudyTitle] = useState('');
    const [date, setDate] = useState(undefined);
    const [range, setRange] = useState({ startDate: undefined, endDate: undefined });
    const [checked, setChecked] = useState('first');
    const [openSingle, setOpenSingle] = useState(false);
    const [openRange, setOpenRange] = useState(false);

    const onFABStateChange = ({ open }) => setFABStatus(open);

    registerTranslation('ko', {
        save: 'Save',
        selectSingle: 'Select date',
        selectMultiple: 'Select dates',
        selectRange: 'Select period',
        notAccordingToDateFormat: (inputFormat) =>
            `Date format must be ${inputFormat}`,
        mustBeHigherThan: (date) => `Must be later then ${date}`,
        mustBeLowerThan: (date) => `Must be earlier then ${date}`,
        mustBeBetween: (startDate, endDate) =>
            `Must be between ${startDate} - ${endDate}`,
        dateIsDisabled: 'Day is not allowed',
        previous: 'Previous',
        next: 'Next',
        typeInDate: 'Type in date',
        pickDateFromCalendar: 'Pick date from calendar',
        close: 'Close',
    })

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
    );

    const onConfirmRange = useCallback(
        ({ startDate, endDate }) => {
            setOpenRange(false);
            setRange({ startDate, endDate });
        },
        [setOpenRange, setRange],
    )

    return (
        <Provider>
            <Portal>
                <View style={Styles.container}>
                    <CalendarList
                        style={Styles.calendar}
                        current={today}
                        pastScrollRange={24}
                        futureScrollRange={24}
                        onDayPress={(day) => {
                            setSelected(day.dateString);
                            console.log('selected day', day);
                            setScheduleCardModal('true')
                        }}
                        markedDates={{
                            [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                        }}
                    />
                    <Modal
                        animationType="fade"
                        visible={scheduleCardModal}
                        transparent={true}
                    >
                        <View style={Styles.modalMainView}>
                            <View style={Styles.cardModalView}>
                                <Text style={{fontSize: "30px"}}>{selected}</Text>
                                <Text>TEST</Text>
                                <Button onPress={() => { setScheduleCardModal(false) }}>close</Button>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType="fade"
                        visible={scheduleAddModal}
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
                                <RadioButton
                                    value="first"
                                    status={checked === 'first' ? 'checked' : 'unchecked'}
                                    onPress={() => setChecked('first')}
                                />
                                <Text
                                    style={Styles.addScheduleBtn}
                                    onPress={() => setOpenSingle(true)}
                                >Select single date</Text>
                                <DatePickerModal
                                    style={Styles.datePicker}
                                    locale="ko"
                                    mode='single'
                                    visible={openSingle}
                                    onDismiss={onDismissSingle}
                                    date={date}
                                    onConfirm={onConfirmSingle}
                                    presentationStyle="page"
                                />
                                <RadioButton
                                    value="second"
                                    status={checked === 'second' ? 'checked' : 'unchecked'}
                                    onPress={() => setChecked('second')}
                                />
                                <Text
                                    style={Styles.addScheduleBtn}
                                    onPress={() => setOpenRange(true)}
                                >Select range date</Text>
                                <DatePickerModal
                                    locale="ko"
                                    mode='range'
                                    visible={openRange}
                                    onDismiss={onDismissRange}
                                    onConfirm={onConfirmRange}
                                    startDate={range.startDate}
                                    endDate={range.endDate}
                                />
                                <Pressable onPress={() => { setScheduleAddModal(false) }}>
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
                                <TextInput
                                    style={Styles.modalInput}
                                    value={scheduleTitle}
                                    placeholder="제목"
                                    textColor="black"
                                    mode="outlined"
                                    onChangeText={groupStudyTitle => setGroupStudyTitle(groupStudyTitle)}
                                />
                                <Button
                                    style={Styles.addScheduleBtn}
                                    onPress={() => setOpenSingle(true)}
                                >Select single date</Button>
                                <DatePickerModal
                                    locale="ko"
                                    mode='single'
                                    visible={openSingle}
                                    onDismiss={onDismissSingle}
                                    date={date}
                                    onConfirm={onConfirmSingle}
                                />
                                <Button
                                    style={Styles.addScheduleBtn}
                                    onPress={() => setOpenRange(true)}
                                >Select range date</Button>
                                <DatePickerModal
                                    locale="ko"
                                    mode='range'
                                    visible={openRange}
                                    onDismiss={onDismissRange}
                                    onConfirm={onConfirmRange}
                                    startDate={range.startDate}
                                    endDate={range.endDate}
                                />
                                <Pressable onPress={() => { setGroupStudyModal(false) }}>
                                    <Text style={Styles.textStyle}>close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <FAB.Group
                        open={FABStatus}
                        icon={FABStatus ? 'close' : 'plus'}
                        actions={[
                            {
                                icon: 'calendar-edit',
                                label: '개인 일정',
                                onPress: () => {
                                    if (FABStatus) {
                                        setScheduleAddModal(true);
                                    }
                                }
                            },
                            {
                                icon: 'account-group',
                                label: '스터디 일정',
                                onPress: () => {
                                    if (FABStatus) {
                                        setGroupStudyModal(true);
                                    }
                                }
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
        width: '100%'
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
    cardModalView: {
        flex: 1,
        justifyContent: 'space-between',
        margin: 20,
        marginTop: '10%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
    },
    modalView: {
        margin: 20,
        marginTop: '40%',
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
        width: 250,
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