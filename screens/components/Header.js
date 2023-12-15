import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

const Header = ({ label }) => {
  return (
    <View style={Styles.header}>
      <View style={{ flex: 3, justifyContent: "flex-start" }}>
        <Text style={Styles.headerTitle}>{label}</Text>
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
