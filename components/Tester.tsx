import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useAtom } from 'jotai';
import { globalLoadingAtom } from '../store';

export default function Tester2() {
    const [ loading, setLoading ] = useAtom(globalLoadingAtom);

	useEffect(() => {
		console.log(`the loading changed: ${loading}`)
	}, [loading]);
  return (
    <View>
      <Text>Tester</Text>
    </View>
  )
}