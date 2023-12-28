import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { Button, FAB, Portal, Provider, Card } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Header from "./components/Header";
import ScheduleCardModal from "./components/ScheduleCardModal";
import ScheduleAddModal from "./components/ScheduleAddModal";
import SignInScreen from "./Auth/SignInScreen";
import Config from "../config/config";

export default function ScheduleScreen() {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const navigation = useNavigation();

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
    const [markedDates, setMarkedDates] = useState({});
    const [isSignInModalVisible, setSignInModalVisible] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            const token = await AsyncStorage.getItem('AccessToken');
            setIsLoggedIn(!!token);

            if (token) {
                fetchTodaySchedule();
            }
        };

        initialize();
    }, [isLoggedIn]);

    const fetchTodaySchedule = async () => {
        const today = new Date();
        const formattedToday = formatDate(today);
        onDayPress({ dateString: formattedToday });
    };

    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();

        mm = mm < 10 ? `0${mm}` : mm;
        dd = dd < 10 ? `0${dd}` : dd;

        return `${yyyy}-${mm}-${dd}`;
    };

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
                return { data: [] };
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
                    backgroundColor: item.isPersonal ? '#FFFFFF' : '#E0F8F7',
                    elevation: 5
                }}>
                <Card.Title
                    title={item.scheduleName}
                    titleStyle={{ color: 'black' }}
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
                    <Text style={{ color: 'black' }}>{item.subjectName}</Text>
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

    const showSignInModal = () => setSignInModalVisible(true);

    const hideSignInModal = () => setSignInModalVisible(false);

    const handleLoginSuccess = () => {
        hideSignInModal();
        const today = new Date();
        const formattedToday = formatDate(today);
        onDayPress({ dateString: formattedToday });
    };

    return (
        
        <Provider>
            <Portal>
                <View style={Styles.container}>
                    <Header
                        label={"일정"}
                        navigation={navigation}
                        fetchData={fetchTodaySchedule}
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
                    <SignInScreen
                        isVisible={isSignInModalVisible}
                        onClose={hideSignInModal}
                        onLoginSuccess={handleLoginSuccess}
                    />
                    {isLoggedIn ? (
                        <>
                            {events.length > 0 ? (
                                <FlatList
                                    data={events}
                                    renderItem={renderScheduleCard}
                                    keyExtractor={(item, index) => item.scheduleName.toString() + item.scheduleId.toString() || index.toString()}
                                    contentContainerStyle={{ flexGrow: 1 }}
                                />
                            ) : (
                                <View style={Styles.noEventsView}>
                                    <Text style={{ color: 'grey' }}>오늘은 일정이 없어요</Text>
                                </View>
                            )}
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
                                        setFABStatus(!FABStatus);
                                    }
                                }}
                            />
                        </>
                    ) : (
                        <View style={Styles.loginPrompt}>
                            <Text style={Styles.loginPromptText}>로그인을 해주세요.</Text>
                            <Button mode="contained" onPress={showSignInModal}>로그인</Button>
                        </View>
                    )}
                </View>
            </Portal>
        </Provider>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    noEventsView: {
        marginTop: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginPrompt: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '50%'
    },
    loginPromptText: {
        fontSize: 16,
        marginBottom: 10
    }
})