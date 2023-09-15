import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider as JotaiProvider } from "jotai";
import C1 from './components/C1';
import C2 from './components/C2';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from 'react-query';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const queryClient = new QueryClient();
  const [ fontsLoaded, fontError ] = useFonts({ 'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf') });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <View style={styles.container} onLayout={onLayoutRootView}>
            <C1 />
            <C2 />
            <StatusBar style="auto" />
        </View>
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
});
