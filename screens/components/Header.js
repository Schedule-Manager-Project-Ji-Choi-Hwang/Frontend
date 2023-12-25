import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton, Menu } from "react-native-paper";

const Header = ({ label }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const changePs = () => {
    console.log("비밀번호 변경");
    setMenuVisible(false);
  }

  const logout = () => {
    console.log("로그아웃");
    setMenuVisible(false);
  }

  return (
    <View style={Styles.header}>
      <View style={{ flex: 3, justifyContent: "flex-start" }}>
        <Text style={Styles.headerTitle}>{label}</Text>
      </View>
      <View style={{ flex: 1 }}></View>
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
        <Menu.Item onPress={changePs} title="비밀번호 변경" />
        <Menu.Item onPress={logout} title="로그아웃" />
      </Menu>
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
