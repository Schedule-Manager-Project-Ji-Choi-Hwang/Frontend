import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MyPage from './screens/MyPage';
import MainPage from './screens/MainPage';
import StudyPage from './screens/StudyPage';

const Tab = createBottomTabNavigator();

function BottomStack() {
    return(
        <Tab.Navigator initialRouteName='MainPage'>
            <Tab.Screen name="MyPage" component={MyPage} />
            <Tab.Screen name="MainPage" component={MainPage} />
            <Tab.Screen name="StudyPage" component={StudyPage} />
        </Tab.Navigator>
    );
}

export default function Navigation() {
    return <BottomStack />;
}