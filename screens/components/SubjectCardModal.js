import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet } from "react-native";
import { Button, TextInput, IconButton, } from "react-native-paper";
import { DatePickerModal } from 'react-native-paper-dates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from "../../config/config";

const SubjectCardModal = () => {

const [visible, setVii]

    return (
        <Modal
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
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
                            mode='outlined'
                            value={editTitle}
                            onChangeText={handleTitleEdit}
                        />
                        <Button
                            style={Styles.contentBtn}
                            labelStyle={{ color: "grey", fontSize: 20 }}
                            mode='outlined'
                            onPress={() => setOpen(true)}
                        >
                            {editDate}
                        </Button>
                        <DatePickerModal
                            animationType="slide"
                            locale="en"
                            mode="single"
                            visible={open}
                            onDismiss={() => setOpen(false)}
                            date={parseDate(editDate)}
                            // presentationStyle='formSheet'
                            onConfirm={(params) => {
                                setOpen(false);
                                setEditDate(formatDate(params.date));
                            }}
                        />
                    </View>
                    <View style={Styles.modalFooter}>
                        <Button
                            style={{ flex: 1 }}
                            mode='contained'
                            onPress={handleSave}
                        >
                            Save</Button>
                        <Button
                            style={{ flex: 1 }}
                            mode='contained'
                            onPress={handleDelete} // delete 버튼 클릭 시 해당 함수 실행
                        >
                            Delete</Button>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default SubjectCardModal;

const Styles = StyleSheet.create({

})