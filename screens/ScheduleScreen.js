import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { FAB, Portal, Provider, Card } from "react-native-paper";
import { registerTranslation } from 'react-native-paper-dates';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Header from "./components/Header";
import ScheduleCardModal from "./components/ScheduleCardModal";
import ScheduleAddModal from "./components/ScheduleAddModal";
import Config from "../config/config";

export default function ScheduleScreen() {

    const [selected, setSelected] = useState('');
    const [events, setEvents] = useState([]);
    const [currentSubjectId, setCurrentSubjectId] = useState('');
    const [currentScheduleName, setCurrentScheduleName] = useState('');
    const [currenPeriod, setCurrentPeriod] = useState('');
    const [currenScheduleId, setCurrenScheduleId] = useState('');
    const [isPersonal, setIsPersonal] = useState(true);
    const [currentColor, setCurrentColor] = useState('');
    const [currentIsPersonal, setCurrentIsPersonal] = useState('');
    const [scheduleCardModal, setScheduleCardModal] = useState(false);
    const [scheduleAddModal, setScheduleAddModal] = useState(false);
    const [groupStudyModal, setGroupStudyModal] = useState(false);
    const [FABStatus, setFABStatus] = useState(false);
    const [scheduleTitle, setScheduleTitle] = useState('');
    const [studyTitle, setStudyTitle] = useState('');
    const [markedDates, setMarkedDates] = useState({})

    useEffect(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();
        if (mm < 10) {
            mm = `0${mm}`;
        }
        if (dd < 10) {
            dd = `0${dd}`;
        }
        const formattedToday = `${yyyy}-${mm}-${dd}`;

        console.log(formattedToday);
        onDayPress({ dateString: formattedToday });
    }, []);

    const onScheduleEdit = async () => {
        if (selected) {
            await onDayPress({ dateString: selected });
        }
    };

    const fetchScheduleDate = async (date) => {
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            if (!token) {
                console.log('No access token');
                return null;
            }
            const response = await axios.get(`${Config.MY_IP}:8080/main?date=${date}`, {
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
            // 개발자 도구 콘솔용
            if (dateData.data.length == 0) {
                console.log("오늘은 일정이 없어요");
            }
            const scheduleArray = [];
            const subjects = dateData.data;

            subjects.forEach(subject => {
                if ('subjectId' in subject) {
                    const subjectId = subject.subjectId;
                    const subjectName = subject.subjectName;
                    const subjectColor = subject.color;
                    const schedules = subject.schedules;

                    schedules.forEach(schedule => {
                        const scheduleId = schedule.scheduleId;
                        const scheduleName = schedule.scheduleName;
                        const period = schedule.period;
                        scheduleArray.push({
                            subjectId: subjectId,
                            subjectName: subjectName,
                            color: subjectColor,
                            scheduleId: scheduleId,
                            scheduleName: scheduleName,
                            period: period,
                            isPersonal: true
                        });
                    })
                } else {
                    const studyPostId = subject.studyPostId;
                    const studyName = subject.studyName;
                    const studySchedules = subject.studySchedules;

                    studySchedules.forEach(studySchedule => {
                        const studyScheduleId = studySchedule.studyScheduleId;
                        const studyScheduleName = studySchedule.studyScheduleName;
                        const period = studySchedule.period;
                        scheduleArray.push({
                            subjectId: studyPostId,
                            subjectName: studyName,
                            scheduleId: studyScheduleId,
                            scheduleName: studyScheduleName,
                            period: period,
                            isPersonal: false
                        });
                    });
                }
            })
            setEvents(scheduleArray);
        } catch (error) {
            console.error('error : ', error);
        }
    };

    const renderScheduleCard = ({ item }) => (
        <Pressable onPress={() => {
            setScheduleCardModal(true);
            setCurrentSubjectId(item.subjectId);
            setCurrentScheduleName(item.scheduleName);
            setCurrentPeriod(item.period);
            setCurrenScheduleId(item.scheduleId);
            setCurrentIsPersonal(item.isPersonal);
            setCurrentColor(item.color);
        }}>
            <Card
                key={item.scheduleId}
                style={{
                    margin: 10,
                    backgroundColor: item.isPersonal ? '#25232a' : '#62662a',
                }}>
                <Card.Title
                    title={item.scheduleName}
                    {...(item.isPersonal && item.color && {
                        left: (props) => (
                            <View {...props} style={{
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                backgroundColor: item.color,
                                marginRight: 10
                            }} />
                        )
                    })} />
                <Card.Content>
                    <Text style={{ color: 'white' }}>{item.subjectName}</Text>
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

    return (
        <Provider>
            <Portal>
                <View style={Styles.container}>
                    <Header
                        label={"공부일정관리앱"}
                    />
                    <Calendar
                        style={Styles.calendar}
                        markingType={'multi-dot'}
                        renderArrow={renderArrow}
                        onDayPress={onDayPress}
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
                    {
                        events.length === 0 ? (
                            <View style={Styles.noEventsView}>
                                <Text style={Styles.noEventsText}>오늘은 일정이 없어요</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={events}
                                renderItem={renderScheduleCard}
                                keyExtractor={(item, index) => item.scheduleName.toString() + item.scheduleId.toString() || index.toString()}
                                contentContainerStyle={{ flexGrow: 1 }}
                            />
                        )
                    }
                    <ScheduleCardModal
                        visible={scheduleCardModal}
                        onClose={() => setScheduleCardModal(false)}
                        onScheduleEdit={onScheduleEdit}
                        scheduleName={currentScheduleName}
                        color={currentColor}
                        period={currenPeriod}
                        scheduleId={currenScheduleId}
                        subjectId={currentSubjectId}
                        isPersonal={currentIsPersonal}
                    />
                    <ScheduleAddModal
                        visible={scheduleAddModal}
                        scheduleTitle={scheduleTitle}
                        onScheduleEdit={onScheduleEdit}
                        onClose={() => setScheduleAddModal(false)}
                        isPersonal={isPersonal}
                        placeholder={"과목을 선택하세요."}
                    />
                    <ScheduleAddModal
                        visible={groupStudyModal}
                        scheduleTitle={studyTitle}
                        onScheduleEdit={onScheduleEdit}
                        onClose={() => setGroupStudyModal(false)}
                        isPersonal={() => setIsPersonal(false)}
                        placeholder={"스터디를 선택하세요."} />
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
    addScheduleBtn: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 15,
        textAlign: 'center',
    }
})