import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { errorAtom } from "../store";
import { useAtom } from "jotai";
import React from "react";

export type MessageType = "alert" | "default" | "success";

export default function PopDown({ message, type }: { message: string, type?: MessageType }) {
    const [ _error, setError ] = useAtom(errorAtom);
    const width = Dimensions.get('window').width;

    const styles = StyleSheet.create({
        cover: {
            position: "relative",
            zIndex: 200,
        },
        box: {
            width: "100%",
            padding: 5,
            position: "absolute",
            flex: 1,
            top: 20,
            left: 0
        },
        innerBox: {
            width: width - 20,
            marginLeft: 5,
            backgroundColor: type === "alert" ? "#EE3F3F" : type === "success" ? "#1cfc03" : "#3A9FE9",
            borderRadius: 2,
            padding: 5,
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row"
        },
        text: {
            color: "#000000",
            fontSize: 15,
            fontWeight: "700",
            fontFamily: "Poppins-SemiBold",
            letterSpacing: 1,
            marginHorizontal: 10,
            flex: 1
        },
        closeButton: {
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
        },
        image: {
            width: 20,
            height: 20
        }
    });

    return (
        <View style={styles.cover}>
            <View style={styles.box}>
                <View style={styles.innerBox}>
                    <Text style={styles.text}>{message}</Text>
                    <TouchableOpacity onPress={() => setError({message: "N/A", type: "default", show: false})} style={styles.closeButton}>
                        <Image style={styles.image} source={require('../assets/closecircle.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}