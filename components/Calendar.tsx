import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { dayToLetter } from '../functions/dateConversion';
import { JobType } from '../functions/getJobsByDates';
import React, { useEffect, useState } from 'react';
import CalendarTile from './CalendarTile';
import SliderToggle from './SliderToggle';
import { userDataAtom } from '../store';
import { useAtom } from 'jotai';
import Key from './Key';

export type DateArray = {day: number, month: number}[];

export default function Calendar({ myJobShow, myJobToggle, monthIndex, month, year, dateArray, changeMonth, monthJobs, clicked }: { myJobShow: boolean, myJobToggle: (arg0: boolean) => any, monthIndex: number, month: string, year: number, dateArray: DateArray, changeMonth: (direction: "left" | "right") => void, monthJobs: JobType[], clicked: (day: number) => any }) {
    const [ userData, _setUserData ] = useAtom(userDataAtom);

    const [ newMonthJobs, setNewMonthJobs ] = useState(monthJobs);
    const [ myDates, setMyDates ] = useState(false);
    
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const newHeight = (windowHeight - 260) / (dateArray.length===42 ? 6 : 5);

    function myDateFilter(job: JobType) {
        if (!myDates) return true;
        const volunteers = JSON.parse(job.volunteer);
        if (!Array.isArray(volunteers)) return false;
        let iminit = false;
        for (let i=0;i<volunteers.length;i++) {
            if (volunteers[i].userId === userData!.ID) {
                iminit=true;
            }
        }
        return iminit
    }

    useEffect(() => setNewMonthJobs(monthJobs.filter(myDateFilter)), [monthJobs, myDates]);
    
    function setType(data: JobType) {
        const type = JSON.parse(data.volunteer);
        if (Array.isArray(type)) {
            let positions = 0;
            for (let i=0;i<type.length;i++) {
                //@ts-ignore
                positions+=type[i].positions;
            }
            return positions === data.positions ? "taken" : "partial";
        } else {
            return "available";
        }
    }

    return (
        <View style={styles.calendar}>
            <SliderToggle option2Selected={myJobShow} width={150} height={35} selected={(data) => {myJobToggle(data===1);setMyDates(data===1)}} option1="All dates" option2='My dates'/>
            <View style={{width: "100%", height: windowHeight - 190, marginTop: 25, marginBottom: 10}}>
                <View style={styles.calendarHeader}>
                    <TouchableOpacity style={styles.clicker} onPress={()=>changeMonth("right")}>
                            <Image style={styles.leftClick}
                            source={require('../assets/left.png')}
                        />
                    </TouchableOpacity>
                    <View style={styles.locationSection}>
                        <Text style={styles.currentLocation}>{month}</Text>
                        <Text style={styles.currentLocationBlue}>{year}</Text>
                    </View>
                    <TouchableOpacity style={styles.clicker} onPress={() => changeMonth("left")}>
                            <Image style={styles.rightClick}
                            source={require('../assets/left.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.calendarRow}>
                        {dayToLetter.map((day) => <View key={`daysForCalendar${day}`} style={{...styles.tile, width: windowWidth / 7}}>
                            <Text style={styles.tileText}>{day}</Text>
                        </View>)}
                </View>
                {dateArray.length===42 || dateArray.length===35 ? <>
                    <View style={[styles.calendarRow, {height: newHeight}]}>
                        {dateArray.slice(0,7).map((val) => {
                            return <CalendarTile gray={val.month!==monthIndex} key={`calendartile${val.day}m${val.month}`} number={val.day} tiles={newMonthJobs.filter((job) => job.day === val.day && job.month === val.month).map(setType)} clicked={() => clicked(val.day)} />
                        })}
                    </View>
                    <View style={[styles.calendarRow, {height: newHeight}]}>
                        {dateArray.slice(7,15).map((val) => {
                            return <CalendarTile gray={val.month!==monthIndex} key={`calendartile${val.day}m${val.month}`} number={val.day} tiles={newMonthJobs.filter((job) => job.day === val.day && job.month === val.month).map(setType)} clicked={() => clicked(val.day)} />
                        })}
                    </View>
                    <View style={[styles.calendarRow, {height: newHeight}]}>
                        {dateArray.slice(14,22).map((val) => {
                            return <CalendarTile gray={val.month!==monthIndex} key={`calendartile${val.day}m${val.month}`} number={val.day} tiles={newMonthJobs.filter((job) => job.day === val.day && job.month === val.month).map(setType)} clicked={() => clicked(val.day)} />
                        })}
                    </View>
                    <View style={[styles.calendarRow, {height: newHeight}]}>
                        {dateArray.slice(21,29).map((val) => {
                            return <CalendarTile gray={val.month!==monthIndex} key={`calendartile${val.day}m${val.month}`} number={val.day} tiles={newMonthJobs.filter((job) => job.day === val.day && job.month === val.month).map(setType)} clicked={() => clicked(val.day)} />
                        })}
                    </View>
                    <View style={[styles.calendarRow, {height: newHeight}]}>
                        {dateArray.slice(28,35).map((val) => {
                            return <CalendarTile gray={val.month!==monthIndex} key={`calendartile${val.day}m${val.month}`} number={val.day} tiles={newMonthJobs.filter((job) => job.day === val.day && job.month === val.month).map(setType)} clicked={() => clicked(val.day)} />
                        })}
                    </View>
                    {dateArray.length===42 ? 
                        <View style={[styles.calendarRow, {height: newHeight}]}>
                            {dateArray.slice(35,42).map((val) => {
                            return <CalendarTile gray={val.month!==monthIndex} key={`calendartile${val.day}m${val.month}`} number={val.day} tiles={newMonthJobs.filter((job) => job.day === val.day && job.month === val.month).map(setType)} clicked={() => clicked(val.day)} />
                        })}
                        </View>
                    : null}
                </> : null}
            </View>
            <Key notAbsolute={true} />
        </View>
    );
}

const styles = StyleSheet.create({
    calendar: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 25
    },
    calendarHeader: {
        width: "100%",
        height: 38,
        backgroundColor: "#000000",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10
    },
    locationSection: {
        flexDirection: "row"
    },
    currentLocation: {
        fontSize: 15 ,
        fontWeight: "900",
        color: "#ffffff",
        fontFamily: "Poppins-SemiBold"
    },
    currentLocationBlue: {
        fontSize: 15 ,
        fontWeight: "900",
        color: "#3A9FE9",
        fontFamily: "Poppins-SemiBold",
        marginLeft: 10
    },
    clicker: {
        width: 38,
        height: 38,
        alignItems: "center",
        justifyContent: "center"
    },
    leftClick: {
        height: 20,
        width: 20
    },
    rightClick: {
        height: 20,
        width: 20,
        transform: [{rotateY: '180deg'}]
    },
    calendarRow: {
        flexDirection: "row",
    },
    tile: {
        height: 25,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#000000",
    },
    tileText: {
        fontSize: 15 ,
        fontWeight: "900",
        fontFamily: "Poppins-SemiBold"
    }
});