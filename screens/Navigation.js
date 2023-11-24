import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CalendarPage from './MainScreens/CalendarPage';
import ListPage from './MainScreens/ListPage';
import RecruitPage from './MainScreens/RecruitPage';
import { Icon } from 'react-native-paper';

const Tab = createBottomTabNavigator();

function BottomStack() {
    return (
        <Tab.Navigator initialRouteName='Calendar'>
            <Tab.Screen
                name="List"
                component={ListPage}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="view-list" color={"grey"} size={30} />
                    )
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarPage}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="calendar" color={"grey"} size={30} />
                    )
                }} />
            <Tab.Screen
                name="Bulletin Board"
                component={RecruitPage}
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