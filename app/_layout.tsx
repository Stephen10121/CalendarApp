import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider as JotaiProvider } from "jotai";
import React, { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Slot } from 'expo-router';
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
					<StatusBar animated={true}  />
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
		position: "relative"
	}
});