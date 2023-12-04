import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ScheduleScreen from './ScheduleScreen';
import ListScreen from './ListScreen';
import GatherScreen from './GatherScreen';
import { Icon } from 'react-native-paper';

const Tab = createBottomTabNavigator();

function BottomStack() {
    return (
        <Tab.Navigator initialRouteName='Schedule'>
            <Tab.Screen
                name="List"
                component={ListScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="view-list" color={"grey"} size={30} />
                    )
                }}
            />
            <Tab.Screen
                name="Schedule"
                component={ScheduleScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="calendar" color={"grey"} size={30} />
                    )
                }} />
            <Tab.Screen
                name="Bulletin Board"
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