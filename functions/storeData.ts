import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeData(value: string) {
    try {
        await AsyncStorage.setItem('@storage_Key', value)
    } catch (e) {
        console.error(e);
    }
}