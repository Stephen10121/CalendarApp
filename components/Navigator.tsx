import { View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { currentRouteAtom } from '../store';
import { useAtom } from 'jotai';
import React from 'react';

export default function Navigator({ profilePic }: { profilePic?: string }) {
    const [ currentRoute, setCurrentRoute ] = useAtom(currentRouteAtom);

    const styles = StyleSheet.create({
        navigation: {
            backgroundColor: "#AAAAAA",
            width: "100%",
            height: 70,
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "row"
        },
        button: {
            height: 50,
            paddingTop: 5,
            position: "relative"
        },
        imageCal: {
            tintColor: currentRoute==="calendar" ? "#767676" : "#000000",
            height: 44,
            width: 48
        },
        imageHome: {
            tintColor: currentRoute==="home" ? "#767676" : "#000000",
            height: 44,
            width: 31
        },
        imageGroup: {
            tintColor: currentRoute==="groups" ? "#767676" : "#000000",
            height: 44,
            width: 37
        },
        imageJob: {
            tintColor: currentRoute==="addJob" ? "#767676" : "#000000",
            height: 44,
            width: 42
        },
        avatar: {
            height: 50,
            width: 50,
            borderRadius: 100
        },
    });

    return (
        <View style={styles.navigation}>
            <TouchableOpacity style={styles.button} onPress={() => setCurrentRoute("home")}>
                <Image style={styles.imageHome}
                source={require('../assets/navigation/home.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setCurrentRoute("calendar")}>
                <Image style={styles.imageCal}
                source={require('../assets/navigation/calendar.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setCurrentRoute("groups")}>
                <Image style={styles.imageGroup}
                source={require('../assets/navigation/groups.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setCurrentRoute("addJob")}>
                <Image style={styles.imageJob}
                source={require('../assets/navigation/addjob.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentRoute("account")}>
                {Platform.OS === "web" ? <img src={profilePic} referrerPolicy="no-referrer" style={styles.avatar} alt="Profile Picture"/> : <Image style={styles.avatar} source={{uri:profilePic}} />}
            </TouchableOpacity>
        </View>
    )
}