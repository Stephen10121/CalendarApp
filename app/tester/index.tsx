import { Redirect, useLocalSearchParams } from "expo-router";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { tokenAtom, userDataAtom } from "../../store";

export default function Tester() {
  const [ token, setToken ] = useAtom(tokenAtom);
	const [ userData, setUserData ] = useAtom(userDataAtom);

  console.log({token, userData})

  // if (!token && !userData) {
	// 	return <Redirect href="/login" />;
	// }
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