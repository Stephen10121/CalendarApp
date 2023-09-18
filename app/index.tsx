import { Link, Redirect, usePathname } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

export default function Page() {
    const jeff = true;

    if (jeff) {
		return <Redirect href="/login" />;
	}
    return (
        <View>
            <Text>Home Page</Text>
        </View>
    );
}