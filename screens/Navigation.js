import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScheduleScreen from './ScheduleScreen';
import SubjectListScreen from './SubjectListScreen';
import ListScreen from './ListScreen';
import GatherScreen from './GatherScreen';

const Tab = createBottomTabNavigator();

function BottomStack() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('AccessToken');
            setIsLoggedIn(!!token);
        };

        checkLoginStatus();
    }, []);

    return (
        <Tab.Navigator initialRouteName='일정'>
            <Tab.Screen
                name="스터디 목록"
                component={ListScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="view-list" color={"grey"} size={30} />
                    )
                }}
            />
            <Tab.Screen
                name="과목"
                component={SubjectListScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="book-open-variant" color={"grey"} size={30} />
                    )
                }}
            />
            <Tab.Screen
                name="일정"
                children={() => <ScheduleScreen isLoggedIn={isLoggedIn} />}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="calendar" color={"grey"} size={30} />
                    )
                }} />
            <Tab.Screen
                name="스터디 게시판"
                component={GatherScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="bulletin-board" color={"grey"} size={30} />
                    )
                }} />
        </Tab.Navigator>
    );
}

export default function Index() {
    return <BottomStack />;
}