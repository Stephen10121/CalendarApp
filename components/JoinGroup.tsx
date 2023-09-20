import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { errorAtom, pendingGroupsAtom, tokenAtom } from '../store';
import { PendingGroupsType } from '../functions/fetchGroups';
import { joinGroup } from '../functions/joinGroup';
import React, { useState } from 'react';
import { useAtom } from 'jotai';
import Input from './Input';

export default function JoinGroup({ close }: { close: () => any }) {
    const [ pendingGroups, setPendingGroups ] = useAtom(pendingGroupsAtom);
    const [ token, _setToken ] = useAtom(tokenAtom);
    const [ _error, setError ] = useAtom(errorAtom);

    const [ groupPassword, setGroupPassword ] = useState("");
    const [ groupId, setGroupId ] = useState("");

    async function joinGroupButton() {
        const data = await joinGroup(groupId, groupPassword, token!);
        if (data.error) {
            setError({ show: true, type: "alert", message: data.error});
            return
        }
        if (!data.groupName || !data.message) {
            setError({ show: true, type: "alert", message: "Failed to join group."});
            return
        }

        const newPending: PendingGroupsType[] = Object.create(pendingGroups);
        newPending.push({ groupId, groupName: data.groupName });

        setPendingGroups(newPending);
        setError({ show: true, type: "success", message: data.message});
        close();
    }

    function Inputs() {
        return (
            <View style={styles.nonScroll}>
                <Input change={setGroupId} placeHolder="Group ID"/>
                <Input change={setGroupPassword} placeHolder="Group Password" marginTop={25}/>
                <TouchableOpacity style={styles.acceptButton} onPress={joinGroupButton}><Text style={styles.acceptButtonText}>Join Group</Text></TouchableOpacity>
            </View>
        );
    }

    if (Platform.OS === "web") {
        return(
            <View style={styles.joinGroup}>
                <Inputs />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.joinGroup}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Inputs />
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    joinGroup: {
        marginTop: 15,
        paddingHorizontal: 30,
        width: "100%",
        height: "100%",
        backgroundColor: "#f3f3f3",
        overflow: "scroll"
    },
    nonScroll: {
        alignItems: "center",
        justifyContent: "flex-start"
    },
    acceptButton: {
        borderRadius: 2,
        backgroundColor: "#3A9FE9",
        fontSize: 10,
        fontWeight: "700",
        fontFamily: "Poppins-SemiBold",
        padding: 5,
        letterSpacing: 1,
        marginRight: 5,
        width: 120,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50
    },
    acceptButtonText: {
        fontSize: 16,
        fontWeight: "700",
        fontFamily: "Poppins-SemiBold",
        color: "#FFFFFF"
    },
    error: {
        fontSize: 15,
        fontWeight: "700",
        fontFamily: "Poppins-SemiBold",
        color: "red",
        marginTop: 20
    },
    success: {
        fontSize: 15,
        fontWeight: "700",
        fontFamily: "Poppins-SemiBold",
    }
});