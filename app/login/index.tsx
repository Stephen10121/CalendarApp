import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ANDROID_CLIENT_ID, EXPO_CLIENT_ID, WEB_CLIENT_ID } from '../../functions/variables';
import { googleLoginOrRegister } from '../../functions/googleLogin';
import * as Google from "expo-auth-session/providers/google";
import PopDownLogin from '../../components/PopDownLogin';
import { storeData } from '../../functions/storeData';
import React, { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { errorAtom } from '../../store';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    const router = useRouter();
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useAtom(errorAtom);
    const [request, response, googlePromptAsync] = Google.useAuthRequest({
        expoClientId: EXPO_CLIENT_ID,
        iosClientId: "",
        androidClientId: ANDROID_CLIENT_ID,
        webClientId: WEB_CLIENT_ID
    });

    async function googleRegisterResponse() {
        if (!response) return false;

        if (response.type !== "success") {
            setError({ message: "Error Using Google Login", show: true, type: "alert"});
            return false;
        }

        const { access_token } = response.params;
        setLoading(true);

        const res2 = await googleLoginOrRegister(access_token);

        if (res2.error) {
            setError({ message: res2.errorMessage, show: true, type: "alert"});
            setLoading(false);
            return false;
        }

        if (!res2.data) {
            setError({ message: "Error Using Google Login", show: true, type: "alert"});
            setLoading(false);
            return false;
        }

        storeData(res2.data.token);
        setLoading(false);
        return true;
    }

    useEffect(() => {
        googleRegisterResponse().then((data) => {
            console.log(data ? "Login Success." : "Login Failure.");
            if (data) router.push("/");
        });
    }, [response]);

    if (loading) {
        return <View style={styles.loading}><ActivityIndicator size="large" color="#3A9FE9" /></View>;
    }

    return (
        <>
            {error.show ? <PopDownLogin message={error.message} type={error.type}/>: null}
            <View style={styles.main}>
                <Text style={styles.welcome}>Welcome</Text>
                <TouchableOpacity disabled={!request} style={styles.googleButton} onPress={async () => await googlePromptAsync()}>
                    <Image style={styles.image}
                    source={require('../../assets/google.png')}
                    />
                    <Text style={styles.text}>Login With Google</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: "#DFDFDF",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20
    },
    welcome: {
        fontSize: 36,
        fontWeight: "700",
        color: "#000000",
        fontFamily: "Poppins-SemiBold"
    },
    googleButton: {
        backgroundColor: "#FFFFFF",
        marginTop: 42,
        borderRadius: 10,
        width: "100%",
        height: 55,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        paddingHorizontal: 10
    },
    image: {
        width: 35,
        height: 35
    },
    text: {
        marginLeft: 25,
        fontSize: 16,
        fontWeight: "700",
        color: "#000000",
        fontFamily: "Poppins-SemiBold"
    },
    loading: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%"
    }
});