import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

const Header = () => {
  return (
    <View style={Styles.header}>
      <View style={{ flex: 3, justifyContent: "center" }}>
        <Text style={Styles.headerTitle}>공부일정관리앱</Text>
      </View>
      <View style={{ flex: 1 }}></View>
      <IconButton
        icon="cog"
        iconColor="grey"
        size={25}
        onPress={() => {
          console.log("setting");
        }}
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
