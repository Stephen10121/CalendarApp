import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { io } from "socket.io-client";


export default function JobChat() {
    useEffect(() => {
        const socket = io("http://localhost:8000");
        socket.on("seq-num", (msg) => console.info(msg));
    }, []);
  return (
    <View>
      <Text>JobChat</Text>
    </View>
  )
}