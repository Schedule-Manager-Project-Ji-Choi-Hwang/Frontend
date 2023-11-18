import React, { useState } from "react";
import {
    View,
    Modal,
    Text,
    Pressable,
    StyleSheet,
} from "react-native";
import { Calendar } from 'react-native-calendars';
import { Ionicons } from "@expo/vector-icons";
import { FAB, Portal, Provider } from 'react-native-paper';

export default function MyPage() {

    const [selected, setSelected] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [FABStatus, setFABStatus] = useState(false);

    const renderArrow = (direction) => {
        return (
            <Ionicons
                name={direction === 'left' ? 'arrow-back' : 'arrow-forward'}
                size={24}
                color="grey"
            />
        )
    }

    const onFABStateChange = ({ open }) => setFABStatus(open);

    return (
        <Provider>
            <Portal>
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
                    <Modal
                        animationType="fade"
                        visible={modalVisible}
                        transparent={true}
                    >
                        <View style={Styles.modalMainView}>
                            <View style={Styles.modalView}>
                                <Text style={Styles.modalText}>Test</Text>
                                <Pressable onPress={() => { setModalVisible(false) }}>
                                    <Text style={Styles.textStyle}>close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <FAB.Group
                        open={FABStatus}
                        visible
                        icon={FABStatus ? 'calendar' : 'plus'}
                        actions={[
                            {
                                icon: 'plus',
                                label: '개인 일정',
                                onPress: () => console.log('Personal Schedule')
                            },
                            {
                                icon: 'plus',
                                label: '개인 공부',
                                onPress: () => console.log('Peronal Study')
                            },
                            {
                                icon: 'plus',
                                label: '스터디 일정',
                                onPress: () => console.log("Group Study")
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
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalMainView: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        marginTop: '60%',
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
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
})