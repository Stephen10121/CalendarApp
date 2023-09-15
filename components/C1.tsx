import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react';
import { useAtom } from "jotai";
import { newTodoAtom } from '../store';

export default function C1() {
    const [newTodo, setNewTodo] = useAtom(newTodoAtom);

    return (
        <View>
            <Button title='set to c1' onPress={() => {
                setNewTodo("c1 set it");
            }} />
            <Text style={styles.text}>C1: {newTodo}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "Poppins-SemiBold",
    }
});