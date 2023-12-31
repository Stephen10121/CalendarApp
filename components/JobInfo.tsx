import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { errorAtom, loadingPopupAtom, tokenAtom, userDataAtom } from "../store";
import { dayToLetter, monthToLetter } from "../functions/dateConversion";
import { useQuery, useQueryClient } from "react-query";
import { JobType } from "../functions/getJobsByDates";
import { POST_SERVER } from "../functions/variables";
import getJobState from "../functions/getJobState";
import { useEffect, useState } from "react";
import SliderToggle from "./SliderToggle";
import EditPosition from "./EditPosition";
import { Border } from "./SlideUp";
import { useAtom } from "jotai";
import Counter from "./Counter";
import JobChat from "./JobChat";
import React from "react";

export interface VolunteerType {
    positions: number;
    fullName: number;
    userId: number;
}

export default function JobInfo({ id, baseInfo, myJob, changeBorder }: { id: number, baseInfo?: JobType, close: () => any, myJob?: boolean, changeBorder?: (color: Border) => any}) {
    // Global State
    const [ _loadingPopup, setLoadingPopup ] = useAtom(loadingPopupAtom);
	const [ userData, _setUserData ] = useAtom(userDataAtom);
    const [ token, _setToken ] = useAtom(tokenAtom);
    const [ _error, setError ] = useAtom(errorAtom);

    // Local State
    const [ volunteerPositions, setVolunteerPositions ] = useState<VolunteerType[]>([]);
    const [ editPositions, setEditPositions ] = useState(false);
    const [ positionsTaken, setPositionsTaken ] = useState(0);
    const [ dateString, setDateString ] = useState("N/A");
    const [ comments, setComments ] = useState(false);
    const [ positions, setPositions ] = useState(1);
    const [ info, setInfo ] = useState(baseInfo);

    const queryClient = useQueryClient();

    // Fetch the job information
    const { status, data, refetch, isRefetching } = useQuery<JobType, Error>(["jobInfo"], async () => {
        const groups = await fetch(`${POST_SERVER}/jobInfo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "omit",
            body: JSON.stringify({
                "jobId": id,
            })
          })
          return await groups.json();
    }, {
        staleTime: 30000,
        refetchInterval: 30000,
        cacheTime: 0
    });


    useEffect(() => {
        if (!info) return;
        
        const date = new Date(info.year, info.month-1, info.day);
        setDateString(`${dayToLetter[date.getDay()]}, ${monthToLetter[date.getMonth()]} ${info.day}, ${info.year}`);
        let volunteerPositions2: VolunteerType[] = [];
        let positionsTaken2 = 0;
        try {
            const volunteers: VolunteerType[] = JSON.parse(info.volunteer);
            if (Array.isArray(volunteers)) {
                volunteerPositions2 = volunteers;
                for (let i=0;i<volunteers.length;i++) {
                    positionsTaken2+=volunteers[i].positions;
                }
            }
            setVolunteerPositions(volunteerPositions2);
            setPositionsTaken(positionsTaken2);
        } catch (err) {
            setVolunteerPositions([]);
        }
    }, [info]);

    async function takeJob() {
        try {
            const groups = await fetch(`${POST_SERVER}/acceptJob`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                credentials: "omit",
                body: JSON.stringify({
                    "jobId": info!.ID,
                    "positions": positions
                })
              })
              await groups.json();
              refetch();
              queryClient.invalidateQueries({ queryKey: [`initialJobsFetch`] });
              queryClient.invalidateQueries({ queryKey: [`jobFetch${info!.month}${info!.year}`] });
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (status !== "loading") {
            setLoadingPopup(null);
        } else {
            setLoadingPopup("Updating Job");
        }
        if (status === "success") {
            setInfo(data);
            if (changeBorder !== undefined) {
                console.log(data)
                const jobState = getJobState(data.volunteer, data.positions);
                changeBorder(jobState === "almost" ? "yellow" : jobState === "available" ? "blue" : "red");
            }
        }
        if (status === "error") {
            setError({ type: "alert", show: true, message: "Cannot Update Job." });
        }
    }, [status, data, isRefetching]);

    return(
        <ScrollView style={styles.groupInfo}>
            <View style={styles.toggleSection}>
                <SliderToggle width={150} height={35} selected={(a) => setComments(a===1)}/>
            </View>
            {comments ? <JobChat /> :
                <View>
                    {info !== undefined ?
                    <>
                    <View style={styles.infoList}>
                        <Text style={styles.li}>• Group: <Text style={styles.span}>{info.groupName}</Text></Text>
                        <Text style={styles.li}>• Issued By: <Text style={styles.span}>{info.issuerName}</Text></Text>
                        <Text style={styles.li}>• Client: <Text style={styles.span}>{info.client.length > 0 ? info.client : "Client not given."}</Text></Text>
                        <Text style={styles.li}>• Address: <Text selectable style={styles.span}>{info.address.length > 0 ? info.address : "Address not given."}</Text></Text>
                        <Text style={styles.li}>• Volunteer{volunteerPositions.length > 1 ? "s" : null}: {volunteerPositions.length!==0 ? null: <Text style={styles.span}>No Volunteers</Text>}</Text>
                        {volunteerPositions.length!==0 ?
                            <View style={styles.volunteerList}>
                                {volunteerPositions.map((volunteer2) => <View style={{...styles.volunteerListItem, width: "100%"}} key={`volunteerlist${volunteer2.userId}`}>
                                    <Text numberOfLines={1} style={[styles.span, {flex: 1}]}>{volunteer2.fullName}</Text>
                                    <View style={styles.editPositionsView}>
                                    {editPositions && volunteer2.userId===userData?.ID ? <EditPosition close={() => setEditPositions(false)}/> : volunteer2.userId === userData!.ID ?
                                    <TouchableOpacity style={styles.positionsBox} onPress={() => setEditPositions(true)}>
                                        <Text style={styles.positionsBox2}>{volunteer2.positions} Position{volunteer2.positions > 1 ? "s" : ""}</Text>
                                    </TouchableOpacity>
                                    : <Text style={styles.positionsBox2}>{volunteer2.positions} Position{volunteer2.positions > 1 ? "s" : ""}</Text>}
                                    </View>
                                </View>)}
                            </View>
                        : null}
                        <Text style={styles.li}>• Time: <Text style={styles.span}>{info.hour}:{info.minute}{info.pm ? "PM":"AM"}</Text></Text>
                        <Text style={styles.li}>• Date: <Text style={styles.span}>{dateString}</Text></Text>
                        <Text style={styles.li}>• Job: <Text style={styles.span}>{info.jobTitle}</Text></Text>
                        <Text style={styles.li}>• Positions: <Text style={styles.span}>{info.positions}</Text></Text>
                    </View>
                    <Text style={[styles.info, {marginTop: 30}]}>Instructions</Text>
                    <View style={styles.infoList}>
                        <Text style={styles.li}>{info.instructions}</Text>
                    </View>
                    
                    {!info.taken ?
                    <View style={styles.getJob}>
                        <Counter value={positions} title="Positions" change={setPositions} minLimit={1} maxLimit={info.positions-positionsTaken}/>
                        <TouchableOpacity style={styles.getJobButton} onPress={takeJob}>
                            <Text style={styles.getJobButtonText}>{myJob ? "Add Position" : "Take Job"}</Text>
                        </TouchableOpacity>
                    </View> : null }
                    </>
                    : null}
                </View>
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    error: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    groupInfo: {
        paddingHorizontal: 25,
        paddingVertical: 15,
        overflow: "scroll",
        width: "100%",
        height: "100%",
        position: "relative"
    },
    info: {
        fontSize: 20,
        fontWeight: "600",
        color: "#000000",
        fontFamily: "Poppins-SemiBold"
    },
    infoList: {
        paddingHorizontal: 10,
        marginTop: 11
    },
        volunteerList: {
        width: "100%",
    },
    volunteerListItem: {
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        flexDirection: "row"
    },
    positionsBox: {
        marginTop: 5,
        backgroundColor: "#dfdfdf",
        padding: 5,
        borderRadius: 5
    },
    editPositionsView: {
        flexDirection: "row"
    },
    positionsBox2: {
        color: "#646464",
        fontSize: 15,
        fontWeight: "700",
        fontFamily: "Poppins-SemiBold",
    },
    li: {
        marginTop: 10,
        fontSize: 15,
        fontWeight: "700",
        color: "#646464",
        fontFamily: "Poppins-SemiBold"
    },
    span: {
        color: "#000000",
        marginTop: 5,
        fontSize: 15,
        fontWeight: "700",
        fontFamily: "Poppins-SemiBold"
    },
    getJob: {
        width: "100%",
        height: 150,
        marginTop: 20
    },
    getJobButton: {
        borderRadius: 2,
        backgroundColor: "#3A9FE9",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        width: "100%"
    },
    getJobButtonText: {
        fontSize: 16,
        fontWeight: "700",
        fontFamily: "Poppins-SemiBold",
        color: "#ffffff",
        letterSpacing: 1,
    },
    toggleSection: {
        width: "100%",
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 0
    },
});