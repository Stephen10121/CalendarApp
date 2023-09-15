import { View, Text, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAtom } from "jotai";
import { newTodoAtom } from '../store';

export default function C2() {
    const [newTodo, setNewTodo] = useAtom(newTodoAtom);
    const [text, setText] = useState("");

    useEffect(() => {
      setText(newTodo);
    }, [newTodo]);

    return (
        <View>
            <Text>{text}</Text>
            <Button title='set to c2' onPress={() => {
                setNewTodo("c2 set it");
            }} />
            <Text>C2: {newTodo}</Text>
        </View>
    )
}