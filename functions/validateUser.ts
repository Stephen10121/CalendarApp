import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleLoginData, fetchUser } from "./fetchUser";

export async function validateUser(): Promise<{ error: true } | { error: false, token: string, userData: GoogleLoginData }> {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if(value === null) return { error: true };

      const data = await fetchUser(value);

      if (data.error || !data.data) return { error: true };

      return {
        error: false,
        token: value,
        userData: data.data.userData
      }
    } catch(e) {
      console.error(e);
      return { error: true }
    }
  }