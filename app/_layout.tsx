import { SafeAreaView, StatusBar, View, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import * as SplashScreen from 'expo-splash-screen';
import { Provider as JotaiProvider } from "jotai";
import React, { useCallback } from 'react';
import { Link, Slot } from 'expo-router';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function HomeLayout() {
	const [ fontsLoaded, fontError ] = useFonts({ 'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf') });
	const queryClient = new QueryClient();
	
	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded || fontError) await SplashScreen.hideAsync();
	}, [fontsLoaded, fontError]);
	
	if (!fontsLoaded && !fontError) return null;
	
	return(
		<QueryClientProvider client={queryClient}>
			<JotaiProvider>
				<SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
					<View>
						<StatusBar animated={true}  />
						<Link style={styles.text} href="/">Home Page</Link>
						<Link style={styles.text} href={{
							pathname: "/tester",
							params: {
								tester: "bob"
							}
						}}>Tester Page</Link>
					</View>
					<Slot />
				</SafeAreaView>
			</JotaiProvider>
		</QueryClientProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontFamily: "Poppins-SemiBold",
	}
});
