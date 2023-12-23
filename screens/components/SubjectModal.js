import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Modal, View, StyleSheet } from "react-native";
import { Button, TextInput, IconButton } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import Config from "../../config/config";


const SubjectModal = ({ visible, onClose, onSubjectAdded }) => {
    const [subjectTitle, setSubjectTitle] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openDropDown, setOpenDropDown] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const colors = [
        { label: "Black", value: "black", icon: () => <View style={getStyleForColor('black')} /> },
        { label: "White", value: "white", icon: () => <View style={getStyleForColor('white')} /> },
        { label: "Blue", value: "blue", icon: () => <View style={getStyleForColor('blue')} /> },
        { label: "Pink", value: "pink", icon: () => <View style={getStyleForColor('pink')} /> },
        { label: "Red", value: "red", icon: () => <View style={getStyleForColor('red')} /> },
        { label: "Yellow", value: "yellow", icon: () => <View style={getStyleForColor('yellow')} /> },
    ];

    const getStyleForColor = (color) => ({
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: color,
        marginRight: 10,
    });
    
    const handleClose = () => {
        setSubjectTitle('');
        setSelectedColor(null);
        onClose();
    };

    const handleAdd = async () => {
        let dataToSend = {
            subjectName: subjectTitle,
            color: selectedColor
        }
        try {
            const token = await AsyncStorage.getItem('AccessToken');
            if (!token) {
                console.log('No access token');
                return null;
            }
            await axios.post(`${Config.MY_IP}:8080/subjects/add`, dataToSend, {
                headers: { Authorization: token }
            });
            onSubjectAdded()
            handleClose();
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
        >
            <View style={Styles.MainModalView}>
                <View style={Styles.modalView}>
                    <View style={Styles.modalHeader}>
                        <IconButton
                            icon="close"
                            iconColor="grey"
                            size={25}
                            onPress={handleClose}
                        />
                    </View>
                    <View style={Styles.modalContent}>
                        <TextInput
                            style={Styles.modalInput}
                            value={subjectTitle}
                            placeholder="과목 이름"
                            mode="outlined"
                            onChangeText={subjectTitle => setSubjectTitle(subjectTitle)}
                        />
                        <DropDownPicker
                            style={Styles.dropDown}
                            theme="LIGHT"
                            open={openDropDown}
                            setOpen={setOpenDropDown}
                            items={colors}
                            setValue={setSelectedColor}
                            value={selectedColor}
                            placeholder="색상 선택"
                            autoScroll={true}
                        />
                    </View>
                    <View style={Styles.modalFooter}>
                        <Button
                            style={{ flex: 1 }}
                            mode='contained'
                            onPress={handleAdd}
                        >
                            등록</Button>
                    </View>
                </View>
            </View>
        </Modal >
    )
}

export default SubjectModal;

const Styles = StyleSheet.create({
    MainModalView: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        marginTop: '70%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        alignItems: "flex-end",
    },
    modalContent: {
        zIndex: 1000
    },
    dropDown: {
        marginTop: 5
    },
    modalFooter: {
        zIndex: 1,
        margin: 5,
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "stretch"
    }
})