import { StyleSheet, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react'

export default function DropDown({ values, change, placeHolder, marginLeft, width }: { values: {label: string, value: any}[], change: (value: any) => any, placeHolder?: string, marginLeft?: number | string, width?: number }) {
    const [selected, setSelected] = useState();
    const styles = StyleSheet.create({
        cover: {
            width: width ? width : "100%",
            height: 54,
            //@ts-ignore
            marginLeft: marginLeft ? marginLeft : 0,
            borderWidth: 2,
            borderColor: "#000000",
            borderStyle: "solid",
            borderRadius: 10,
            paddingHorizontal: 5,
        },
        text: {
            fontSize: 13,
            fontWeight: "500",
            fontFamily: "Poppins-SemiBold",
            color: "#000000",
            //@ts-ignore
            marginLeft: marginLeft ? marginLeft : 0,
        },
        dropdown: {
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 0,
            backgroundColor: "#dfdfdf",
            fontSize: 13,
            fontWeight: "500",
            fontFamily: "Poppins-SemiBold",
            color: "#000000",
            //@ts-ignore
            outlineStyle: 'none'
        },
        title: {
            fontSize: 13,
            fontWeight: "500",
            fontFamily: "Poppins-SemiBold",
            color: "#000000",
            //@ts-ignore
            marginLeft: marginLeft ? marginLeft : 0,
        }
    });

    return (
        <View>
            <Text style={styles.title}>{placeHolder}</Text>
            <View style={styles.cover}>
                <Picker style={styles.dropdown} selectedValue={selected} onValueChange={(itemValue, _itemIndex) => {setSelected(itemValue);change(itemValue)}}>
                    {values.map((value) => <Picker.Item style={styles.text} key={`${placeHolder}${value.value}`} label={value.label} value={value.value}/>)}
                </Picker>
            </View>
        </View>
    );
}