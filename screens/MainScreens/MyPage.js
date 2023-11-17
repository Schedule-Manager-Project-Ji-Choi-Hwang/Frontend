import React, { useState } from "react";
import {
    View,
    Pressable,
    StyleSheet,
} from "react-native";
import { Calendar } from 'react-native-calendars';
import { Ionicons } from "@expo/vector-icons";
import { FAB } from 'react-native-paper';

export default function MyPage() {

    const [selected, setSelected] = useState('');
    const renderArrow = (direction) => {
        return (
            <Ionicons
                name={direction === 'left' ? 'arrow-back' : 'arrow-forward'}
                size={24}
                color="black"
            />
        )
    }

    return (
        <View style={Styles.container}>
            <Calendar
                style={Styles.calendar}
                renderArrow={renderArrow}
                onDayPress={(day) => {
                    setSelected(day.dateString);
                    console.log('selected day', day);
                }}
                markedDates={{
                    [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                }}
            />
            <FAB
                icon="plus"
                style={Styles.fab}
                onPress={() => console.log("pressed")} />
        </View>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    calendar: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})