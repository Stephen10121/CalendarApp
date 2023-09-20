import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { errorAtom, groupsAtom, tokenAtom } from '../store';
import { createGroup } from '../functions/createGroup';
import React, { useState } from 'react';
import Checkbox from 'expo-checkbox';
import { useAtom } from 'jotai';
import Input from './Input';

export default function CreateGroup({ close }: { close: () => any }) {
	const [ groups, setGroups ] = useAtom(groupsAtom);
	const [ token, _setToken ] = useAtom(tokenAtom);
	const [ _error, setError ] = useAtom(errorAtom);

	const [ repeatGroupPassword, setRepeatGroupPassword ] = useState("");
	const [ groupPassword, setGroupPassword ] = useState("");
	const [ aboutGroup, setAboutGroup ] = useState("");
	const [ isChecked, setChecked ] = useState(false);
	const [ groupName, setGroupName ] = useState("");
	const [ groupId, setGroupId ] = useState("");

	async function createGroupButton() {
		if (groupPassword !== repeatGroupPassword) {
			setError({ show: true, type: "alert", message: "The Passwords dont match."});
			return
		}
		const data = await createGroup(groupId, groupName, groupPassword, isChecked, aboutGroup, token!);
		if (data.error || !data.data) {
			setError({ show: true, type: "alert", message: data.error ? data.error : "Couldn't create group."});
			return
		}
		console.log(data.data);
		setError({ show: true, type: "success", message: "Success"});
		setGroups([...groups, data.data]);
		close();
	}

	function Inputs() {
		return (
			<View style={styles.nonScroll}>
				<Input change={setGroupName} placeHolder="Group Name"/>
				<Input change={setGroupId} placeHolder="Set Group ID" marginTop={25}/>
				<Input change={setGroupPassword} placeHolder="Group Password" marginTop={25}/>
				<Input change={setRepeatGroupPassword} placeHolder="Repeat Group Password" marginTop={25}/>
				<Input change={setAboutGroup} placeHolder="About Group" marginTop={25} multiLine={true}/>
				<View style={styles.checkboxPart}>
					<Text style={styles.checkboxText}>Allow others to add Jobs</Text>
					<Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
				</View>
				<TouchableOpacity style={styles.acceptButton} onPress={createGroupButton}><Text style={styles.acceptButtonText}>Make Group</Text></TouchableOpacity>
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
	)
}

const styles = StyleSheet.create({
	joinGroup: {
		marginTop: 15,
		paddingHorizontal: 30,
		width: "100%",
		height: "100%",
		backgroundColor: "#f3f3f3",
		overflow: "scroll",
		flex: 1
	},
	nonScroll: {
		alignItems: "center",
		justifyContent: "flex-start",
		flex: 1
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
		marginTop: 42
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
	},
	checkboxPart: {
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
		marginTop: 25,
		width: "100%"
	},
	checkboxText: {
		fontSize: 13,
		fontWeight: "500",
		fontFamily: "Poppins-SemiBold",
		color: "#000000"
	},
	checkbox: {
		margin: 8,
	}
});