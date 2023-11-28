import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function SplashScreen() {

  const [animating, setAnimating] = useState(true);
  const navigation = useNavigation();
  // navigation.navigate('Navigation')
  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      handleGetToken();
    }, 2000);
  }, []);

  const handleGetToken = async () => {
    const dataToken = await AsyncStorage.getItem("AccessToken");
    if (!dataToken) {
      navigation.replace("Auth");
    } else {
      navigation.replace("Navigation");
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splash.png')}
        style={{ width: '90%', resizeMode: 'contain', margin: 30 }}
      />
      <ActivityIndicator
        animating={animating}
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#307ecc',
  },
  activityIndicator: {
    alignItems: 'center'
  },
});