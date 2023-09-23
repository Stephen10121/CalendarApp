import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { io } from "socket.io-client";


export default function JobChat() {
    useEffect(() => {
        const socket = io("https://calsocket.stephengruzin.dev");
        socket.on("seq-num", (msg: string) => console.info(msg));
        return () => {
          socket.disconnect();
        }
    }, []);
  return (
    <View>
      <Text>JobChat</Text>
    </View>
  )
}