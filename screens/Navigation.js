import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MyPage from './MainScreens/MyPage';
import HomePage from './MainScreens/HomePage';
import StudyPage from './MainScreens/StudyPage';

const Tab = createBottomTabNavigator();

function BottomStack() {
    return(
        <Tab.Navigator initialRouteName='MainPage'>
            <Tab.Screen name="MyPage" component={MyPage} options={{headerShown:false}} />
            <Tab.Screen name="MainPage" component={HomePage} options={{headerShown:false}}/>
            <Tab.Screen name="StudyPage" component={StudyPage} options={{headerShown:false}}/>
        </Tab.Navigator>
    );
}

export default function Index() {
    return <BottomStack />;
}