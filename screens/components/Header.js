import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState } from "react";
import { View, Text, Alert, StatusBar, StyleSheet, SafeAreaView } from "react-native";
import { IconButton, Menu } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import PasswordChangeScreen from "../PasswordChangeScreen";
import Config from "../../config/config";

const Header = ({ label }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [pschangeModal, setPsChangeModal] = useState(false);

  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const deleteAlert = () => {
    Alert.alert(
      "회원탈퇴를 진행하시겠습니까?",
      "모든 정보가 삭제됩니다.",
      [
        {
          text: '예',
          onPress: () => deleteAccount(),
        },
        {
          text: '아니요',
          onPress: () => closeMenu(),
          style: 'cancel'
        }
      ],
      {
        cancelable: false,
      }
    )
  };

  const deleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('AccessToken');
      if (!token) {
        console.log('No access token');
        return null;
      }
      await axios.delete(`${Config.MY_IP}:8080/member/delete`, {
        header: { 'Authorization': token }
      })
      await AsyncStorage.removeItem('AccessToken');
      await AsyncStorage.removeItem('Refresh-Token');
      setIsLoggedIn(false);
      Alert.alert("회원 탈퇴", "계정이 삭제되었습니다.");
    } catch (error) {
      console.log("Delete Error : ", error);
    }
    setMenuVisible(false);
  }

  const changePs = () => {
    setPsChangeModal(true);
    setMenuVisible(false);
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('AccessToken');
      await AsyncStorage.removeItem('Refresh-Token');
      setIsLoggedIn(false);
    } catch (error) {
      console.log('Logout error:', error);
    }
    setMenuVisible(false);
  }

  return (
    <View style={Styles.header}>
      <StatusBar />
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <Text style={Styles.headerTitle}>{label}</Text>
      </View>
      <View style={{ flex: 1 }}></View>
      {isLoggedIn && (
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <IconButton
              icon="cog"
              iconColor="grey"
              size={25}
              onPress={openMenu}
            />
          }>
          <Menu.Item onPress={deleteAlert} title="회원탈퇴" />
          <Menu.Item onPress={changePs} title="비밀번호 변경" />
          <Menu.Item onPress={logout} title="로그아웃" />
        </Menu>
      )}
      <PasswordChangeScreen
        isVisible={pschangeModal}
        onClose={() => setPsChangeModal(false)}
      />
    </View>
  );
};

export default Header;

const Styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    height: 45,
    backgroundColor: "white",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    textAlign: "center",
  },
});
