import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Tester() {
  const params = useLocalSearchParams();

  useEffect(() => {
    console.log(params);
  });
  return (
    <View>
      <Text style={styles.text}>Tester Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
      fontFamily: "Poppins-SemiBold",
  }
});