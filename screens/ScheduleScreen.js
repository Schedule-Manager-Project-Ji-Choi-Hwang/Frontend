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
import AddScheduleModal from "./components/AddScheduleModal";
import Config from "../config/config";

export default function ScheduleScreen() {

    const [selected, setSelected] = useState('');
    const [events, setEvents] = useState([]);
    const [currentSubjectId, setCurrentSubjectId] = useState('');
    const [currentScheduleName, setCurrentScheduleName] = useState('');
    const [currenPeriod, setCurrentPeriod] = useState('');
    const [currenScheduleId, setCurrenScheduleId] = useState('');
    const [currentIsPersonal, setCurrentIsPersonal] = useState(''); // 개인 일정, 스터디 일정 구분하기 위한 state
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

    // 페이지에 처음 접근 시 오늘 날짜를 클릭, 자동으로 오늘 날짜의 일정 데이터들을 출력
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

    // 일정 카드를 눌러 수정 및 삭제하였을 때, 모달창을 닫기 전, 이전 선택한 날짜를 클릭
    // 수정 및 삭제 시, 즉시 서버에 요청하여 마지막으로 클릭한 날짜의 변경된 데이터를 기준으로 화면을 출력 (즉, 화면 갱신)
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
            const subjects = dateData.data; // 과목 및 스터디 리스트
            console.log(`날짜: ${day.dateString}, 일정: ${subjects}`);

            subjects.forEach(subject => { // 과목 및 스터디 리스트를 순회
                if ('subjectId' in subject) { // 현재 순회중인 객체가 개인 과목일 경우.
                    const subjectId = subject.subjectId;
                    const subjectName = subject.subjectName;
                    const schedules = subject.schedules;

                    schedules.forEach(schedule => { // 현재 순회중인 객체의 일정 리스트를 순회
                        const scheduleId = schedule.scheduleId;
                        const scheduleName = schedule.scheduleName;
                        const period = schedule.period;
                        scheduleArray.push({ // 스케쥴 리스트에 현재 순회중인 일정 데이터 객체 형태로 추가
                            subjectId : subjectId,
                            subjectName : subjectName,
                            scheduleId : scheduleId,
                            scheduleName : scheduleName,
                            period : period,
                            isPersonal : true // 개인 과목의 일정인 경우 해당 속성 true
                        });
                    })
                } else { // 현재 순회중인 객체가 스터디 객체인 경우
                    const studyPostId = subject.studyPostId;
                    const studyName = subject.studyName;
                    const studySchedules = subject.studySchedules;

                    studySchedules.forEach(studySchedule => { // 현재 순회중인 객체의 일정 리스트를 순회
                        const studyScheduleId = studySchedule.studyScheduleId;
                        const studyScheduleName = studySchedule.studyScheduleName;
                        const period = studySchedule.period;
                        scheduleArray.push({ // 스케쥴 리스트에 현재 순회중인 일정 데이터 객체 형태로 추가
                            subjectId : studyPostId,
                            subjectName : studyName,
                            scheduleId : studyScheduleId,
                            scheduleName : studyScheduleName,
                            period : period,
                            isPersonal : false // 스터디 그룹의 일정인 경우 해당 속성 false
                        });
                    });
                }
            })
            console.log(scheduleArray);
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
        }}>
            <Card key={item.scheduleId} style={{ margin: 10 }}>
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
                        // current={today} // 이 설정은 기본값이 사용자의 현재 시점(Month)로 설정된다고 함.
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
                    { // 일정 데이터가 하나도 없다면 텍스트가 보이고, 있다면 카드들이 출력됨
                        events.length === 0 ? (
                            <View style={Styles.noEventsView}>
                                <Text style={Styles.noEventsText}>오늘은 일정이 없어요</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={events}
                                renderItem={renderScheduleCard}
                                // 기존값이 겹친다고 나와서 현재 일정 이름 + id 값 사용중, 추후에 더 확실한 고유값 사용하도록 변경해야함
                                keyExtractor={(item, index) => item.scheduleName.toString() + item.scheduleId.toString() || index.toString()}
                                contentContainerStyle={{ flexGrow: 1 }}
                            />
                        )
                    }
                    <ScheduleCardModal
                        visible={scheduleCardModal}
                        onClose={() => setScheduleCardModal(false)}
                        onScheduleEdit={onScheduleEdit} // 일정 수정 및 삭제 시 실행될 콜백함수 지정
                        scheduleName={currentScheduleName}
                        period={currenPeriod}
                        scheduleId={currenScheduleId}
                        subjectId={currentSubjectId}
                        isPersonal={currentIsPersonal} // 수정 모달에서 사용할 개인 및 스터디 구별하는 값
                    />
                    <AddScheduleModal
                        visible={scheduleAddModal}
                        scheduleTitle={scheduleTitle}
                        onClose={() => setScheduleAddModal(false)}
                    />
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
    }
})