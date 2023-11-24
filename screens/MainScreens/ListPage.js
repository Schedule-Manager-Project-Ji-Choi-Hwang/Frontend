import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

export default function ListPage() {
    return (
        <View style={Styles.container}>
            <View style={Styles.header}>
                        <View style={{ flex: 3, justifyContent: 'center' }}>
                            <Text style={Styles.headerTitle}>스터디 목록</Text>
                        </View>
                        <View style={{ flex: 1 }}></View>
                        <IconButton
                            style={Styles.settingBtn}
                            icon="cog"
                            iconColor="grey"
                            size={25}
                            onPress={() => { console.log('setting') }}
                        />
                    </View>
        </View>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
    },
    header: {
        flexDirection: 'row',
        height: 45,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 20,
        textAlign: 'center'
    },
    settingBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },

})