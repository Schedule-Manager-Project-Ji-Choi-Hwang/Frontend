import React, { useState } from "react";
import { Modal, View, StyleSheet } from "react-native";
import { Button, TextInput, IconButton } from "react-native-paper";

const SubjectModal = ({ visible, onClose }) => {
    const [subjectTitle, setSubjectTitle] = useState('');
    const [openModal, setOpenModal] = useState(false);
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
                            onPress={onClose}
                        />
                    </View>
                    <View style={Styles.modalContent}>
                        <TextInput
                            style={Styles.modalInput}
                            value={subjectTitle}
                            placeholder="과목 이름"
                            textColor="black"
                            mode="outlined"
                            onChangeText={subjectTitle => setSubjectTitle(subjectTitle)}
                        />

                        {/* <View>
                            <DropDownPicker
                                style={Styles.dropDown}
                                theme="LIGHT"
                                open={openDropDown}
                                setOpen={setOpenDropDown}
                                items={items}
                                setItems={setItems}
                                value={select}
                                setValue={setSelect}
                                placeholder={placeholder}
                                autoScroll={true}
                            />
                        </View> */}
                    </View>
                    <View style={Styles.modalFooter}>
                        <Button
                            style={{ flex: 1, zIndex: 1 }}
                            mode='contained'
                            onPress={()=> console.log("등록")}
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
    modalFooter: {
        margin: 5,
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "stretch"
    }
})