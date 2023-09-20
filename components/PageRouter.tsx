import { currentRouteAtom, groupsAtom, jobsAtom, pendingGroupsAtom, tokenAtom, userDataAtom } from "../store";
import { GetJobsByDatesResponse, JobType, getJobsByDates } from "../functions/getJobsByDates";
import { FetchGroupsResponse, fetchGroups } from "../functions/fetchGroups";
import { Dimensions, StyleSheet, View } from "react-native";
import addJobMonth from "../functions/addJobMonth";
import CalendarSection from "./CalendarSection";
import HomeSection from "./HomeSection";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { useAtom } from "jotai";
import React from "react";
import GroupSection from "./GroupSection";

export type RemoveGroup = (groupId: string) => void;
export type RemovePendingGroup = (pendingGroupId: string) => void;

export default function LoggedIn() {
	// Jotai Stores
	const [ _pendingGroups, setPendingGroups ] = useAtom(pendingGroupsAtom);
	const [ currentRoute, _setCurrentRoute ] = useAtom(currentRouteAtom);
	const [ userData, _setUserData ] = useAtom(userDataAtom);
	const [ _groups, setGroups ] = useAtom(groupsAtom);
	const [ token, _setToken ] = useAtom(tokenAtom);
	const [ jobs, setJobs ] = useAtom(jobsAtom);

	// Other Variables
	const now = new Date();
	const month = now.getUTCMonth() + 1;
	const year = now.getUTCFullYear();
	const win = Dimensions.get('window');

	// Group Fetch
	const groupFetch = useQuery<FetchGroupsResponse, Error>(["groups"], () => fetchGroups(token!), { staleTime: 30000, refetchInterval: 30000 });
	const threeMonthJobs = useQuery<GetJobsByDatesResponse, Error>([`initialJobsFetch`], () => getJobsByDates(token!, [month-1, month, month+1], year), { staleTime: 30000, refetchInterval: 30000 });

	async function setGroupsAndJobs(data: FetchGroupsResponse) {
		if (!data.data) return
		if (data.data.groups !== null) setGroups(data.data.groups);
		setPendingGroups(data.data.pendingGroups ? data.data.pendingGroups: []);
	}

	useEffect(() => {
		const { data, status } = groupFetch;
		if (status === "success") setGroupsAndJobs(data);
	}, [groupFetch.status, groupFetch.data]);

	useEffect(() => {
		const { data, status } = threeMonthJobs;
		if (status !== "success") return
		console.log("Fetched 3 months jobs.");

		if (!data.jobs) return

		const jobArray = data.jobs;
		let newJobsObject = jobs;

		for (let i=0;i<Object.keys(jobArray).length;i++) {
			const newJobs = jobArray[Object.keys(jobArray)[i]] as any as JobType[];
			if (newJobs.length===0) continue;

			newJobsObject = addJobMonth(newJobsObject, year, {
				month: parseInt(Object.keys(jobArray)[i]),
				jobs: newJobs
			});
		}
		setJobs(newJobsObject);
	}, [threeMonthJobs.status, threeMonthJobs.data]);

	const styles = StyleSheet.create({
		main: {
			width: "100%",
			height: "100%",
			backgroundColor: "#dfdfdf",
			position: "relative"
		},
		body: {
			height: currentRoute !== "account" ? win.height - 70 : 0,
			display: 'flex',
			flexDirection: "row",
			overflow: "hidden"
		},
		section: {
			width: "100%",
			height: win.height - 70,
			backgroundColor: "blue",
			display: 'none'
		},
		sectionHome: {
			width: "100%",
			height: win.height - 70,
			display: currentRoute === "home" ? "flex" : 'none',
			position: "relative"
		},
		sectionCal: {
			width: "100%",
			height: win.height - 70,
			display: currentRoute === "calendar" ? "flex" : 'none'
		},
		sectionGroup: {
			width: "100%",
			height: win.height - 70,
			display: currentRoute === "groups" ? "flex" : 'none'
		},
		sectionJob: {
			width: "100%",
			height: win.height - 70,
			display: currentRoute === "addJob" ? "flex" : 'none'
		},
		text: {
			position:"absolute",
			bottom: 0
		}
	});
	return (
		<>
			<View style={styles.sectionHome}>
				<HomeSection name={userData!.name} />
			</View>
			<View style={styles.sectionCal}>
				<CalendarSection />
			</View>
			<View style={styles.sectionGroup}>
				<GroupSection />
			</View>
			<View style={styles.sectionJob}>
				{/* <AddJobSection /> */}
			</View>
		</>
	);
}