import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Modal,
    Text,
    Pressable,
    StyleSheet,
    FlatList,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import {
    Button,
    FAB,
    Portal,
    Provider,
    TextInput,
    RadioButton,
    Card,
} from "react-native-paper";
import { DatePickerModal, registerTranslation } from 'react-native-paper-dates';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Header from "./components/Header";
import ScheduleCardModal from "./components/ScheduleCardModal";

export default function ScheduleScreen() {

    const today = new Date();

    const [selected, setSelected] = useState('');
    const [events, setEvents] = useState([]);
    const [currentScheduleName, setCurrentScheduleName] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [scheduleCardModal, setScheduleCardModal] = useState(false);
    const [subjectAddModal, setSubjectAddModal] = useState(false);
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
    const [markedDates, setMarkedDates] = useState({})

    const fetchScheduleDate = async (date) => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            if (!token) {
                console.log('No access token');
                return null;
            }
            const response = await axios.get(`http://localhost:8080/main?date=${date}`, {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    const onDayPress = async (day) => {
        setSelected(day.dateString);
        try {
            const dateData = await fetchScheduleDate(day.dateString);
            const scheduleArray = [];
            const subjectList = dateData.data;
            for (let i = 0; i < subjectList.length; i++) {
                const schedules = subjectList[i];
                const dailySchedule = schedules.studySchedules;
                for (let j = 0; j < dailySchedule.length; j++) {
                    scheduleArray.push(dailySchedule[j]);
                    setEvents(scheduleArray);
                }
            }
        } catch (error) {
            console.error('error : ', error);
        }
    };

    const renderScheduleCard = ({ item }) => (
        <Pressable onPress={() => {
            setCurrentScheduleName(item.scheduleName);
            setScheduleCardModal(true);
            setSelectedPeriod(item.period);
        }}>
            <Card key={item.studyScheduleId} style={{ margin: 10 }}>
                <Card.Title title={item.scheduleName} />
                <Card.Content>
                    <Text style={{ color: 'white' }}>{item.period}</Text>
                </Card.Content>
            </Card>
        </Pressable>
    );


    const onFABStateChange = ({ open }) => setFABStatus(open);

    const renderArrow = (direction) => {
        return (
            <Ionicons
                name={direction === 'left' ? 'arrow-back' : 'arrow-forward'}
                size={24}
                color='grey'
            />
        )
    }

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

    useEffect(() => {
        setSelected(today);
    }, []);

    return (
        <Provider>
            <Portal>
                <View style={Styles.container}>
                    <Header />
                    <Calendar
                        style={Styles.calendar}
                        markingType={'multi-dot'}
                        renderArrow={renderArrow}
                        onDayPress={onDayPress}
                        current={today}
                        markedDates={{
                            ...markedDates,
                            [selected]: {
                                ...markedDates[selected],
                                selected: true,
                                selectedTextColor: 'orange',
                                selectedColor: 'white',
                            },
                        }}
                    />
                    <FlatList
                        data={events}
                        renderItem={renderScheduleCard}
                        keyExtractor={(item, index) => item.studyScheduleId.toString() || index.toString()}
                        contentContainerStyle={{ flexGrow: 1, }}
                    />
                    <ScheduleCardModal
                        visible={scheduleCardModal}
                        onClose={() => setScheduleCardModal(false)}
                        scheduleName={currentScheduleName}
                        period={selectedPeriod}
                    />

                    {/* <Modal
                        animationType="fade"
                        visible={subjectAddModal}
                        transparent={true}
                    >
                        <View style={Styles.modalMainView}>
                            <View style={Styles.modalView}>
                                <TextInput
                                    style={Styles.modalInput}
                                    value={subjectTitle}
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
                    </Modal> */}
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
                                icon: 'book-plus',
                                label: '과목 등록',
                                onPress: () => {
                                    if (FABStatus) {
                                        naviagion.replace("AddSubjectPage");
                                    }
                                }
                            },
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
    card: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    scroll: {
        marginHorizontal: 20
    },
    centeredView: {
        flex: 1,
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
        margin: 20,
        marginTop: '10%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
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