import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ScheduleScreen from './ScheduleScreen';
import SubjectListScreen from './SubjectListScreen';
import ListScreen from './ListScreen';
import GatherScreen from './GatherScreen';
import { Icon } from 'react-native-paper';

const Tab = createBottomTabNavigator();

function BottomStack() {
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
                component={ScheduleScreen}
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