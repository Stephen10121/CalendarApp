import { closeInternalAtom, loadingPopupAtom, slideUpAtom, slideUpBorderColorAtom, tokenAtom, userDataAtom } from '../store';
import { GetJobsByDateResponse, getJobsByDate } from '../functions/getJobsByDate';
import { getDaysInAmonth, monthToLetterFull } from '../functions/dateConversion';
import { JobType } from '../functions/getJobsByDates';
import React, { useEffect, useState } from 'react';
import Calendar, { DateArray } from './Calendar';
import { useQuery } from 'react-query';
import { View } from 'react-native';
import { Border } from './SlideUp';
import JobInfo from './JobInfo';
import { useAtom } from 'jotai';
import BigDate from './BigDate';

export default function CalendarSection() {
    const [ daysInMonth, setDaysInMonth ] = useState<number | null>(null);
    const [ dateArray, setDateArray ] = useState<DateArray>([]);
    const [ monthJobs, setMonthJobs ] = useState<JobType[]>([]);
    const [ jobForDay, setJobForDay ] = useState<JobType[]>([]);
    const [ onlyMyJobs, setOnlyMyJobs ] = useState(false);
    const [ showBig, setShowBig ] = useState(false);
    const [ year, setYear ] = useState(2023);
    const [ month, setMonth ] = useState(2);
    const [ day, setDay ] = useState(1);

    const [ _slideUpBorderColor, setSlideUpBorderColor ] = useAtom(slideUpBorderColorAtom);
	const [ _closeInternal, setCloseInternal ] = useAtom(closeInternalAtom);
    const [ _loadingPopup, setLoadingPopup ] = useAtom(loadingPopupAtom);
    const [ _showSlideUp, setShowSlideUp ] = useAtom(slideUpAtom);
	const [ userData, _setUserData ] = useAtom(userDataAtom);
    const [ token, _setToken ] = useAtom(tokenAtom);

    const nextMonthJobs = useQuery<GetJobsByDateResponse, Error>([`jobFetch${month}${year}`], () => getJobsByDate(token!, month, year), { staleTime: 30000, refetchInterval: 30000 });

    function changeDateArray() {
        const date = new Date(year, month-1, 1);
        const dayOfFirstDate = date.getDay();
        const daysInAMonth = getDaysInAmonth(year, month);
        const daysInPrevMonth = getDaysInAmonth(month<1?year:year-1, month>1?month-1:12);

        let calendarFormatedDateArray: DateArray = [];
        for (let i=1;i<=dayOfFirstDate;i++) calendarFormatedDateArray.unshift({day: daysInPrevMonth-i, month: month-1});
        for (let i=1;i<=daysInAMonth;i++) calendarFormatedDateArray.push({day: i, month});
        for (let i=1;i<=(calendarFormatedDateArray.length >= 36 ? 42 : 35)-dayOfFirstDate-daysInAMonth;i++) calendarFormatedDateArray.push({day: i, month: month+1});

        setDateArray(calendarFormatedDateArray);
        setDaysInMonth(daysInAMonth);

        if (day===0) setDay(daysInAMonth);
    }

    function changeMonth(direction: "left" | "right"): void {
        setLoadingPopup("Loading");
        if (direction ==="left") {
            if (month===12) {
                setYear(year+1);
                setMonth(1);
                return;
            }
            setMonth(month+1);
            return
        }
        if (month===1) {
            setYear(year-1);
            setMonth(12);
            return;
        }
        setMonth(month-1);
    }

    useEffect(() => {
        const { data, status } = nextMonthJobs;
        setLoadingPopup(status === "loading" ? "Loading" : null);
        if (status !== "success") return

        console.log(`Fetched jobs for ${month}, ${year}.`);
        if (data.jobs) {
            setMonthJobs(data.jobs);
            setJobForDay(data.jobs.filter(job => job.day === day));
        }
      }, [nextMonthJobs.status, nextMonthJobs.data]);

    useEffect(changeDateArray, [year, month]);
    useEffect(() => setJobForDay(monthJobs.filter(job => job.day === day)), [day]);

    function clicked(givenDay: number) {
        setDay(givenDay);
        setShowBig(true);
    }

    function yesterday() {
        setDay(day-1);
        if (day === 1) changeMonth("right");
    }

    function tomorrow() {
        if (!daysInMonth) return
        if (day >= daysInMonth) {
            setDay(1);
            changeMonth("left");
            return
        }
        setDay(day+1);
    }

    function jobClicked(job: JobType) {
        const type = JSON.parse(job.volunteer);
        let color: Border = "yellow";
        let myJob = false;

        if (Array.isArray(type)) {
			let positions = 0;
			for (let i=0;i<type.length;i++) {
				//@ts-ignore
				positions+=type[i].positions;
                if (type[i].userId === userData!.ID) {
                    myJob = true;
                }
			}
			if (positions === job.positions) {
				color = "red";
			}
		} else {
            color = "blue";
		}
        setSlideUpBorderColor(color);
        setShowSlideUp({ show: true, header: job.jobTitle, children: <JobInfo changeBorder={borderChange} id={job.ID} myJob={myJob} close={() => setCloseInternal(true)} baseInfo={job}/> });
    }

    function borderChange(color: Border) {setSlideUpBorderColor(color)}

    return (
        <View style={{width: "100%",height:"100%"}}>
            {showBig ? <BigDate myJobToggle={setOnlyMyJobs} myJobShow={onlyMyJobs} clicked={jobClicked} close={() => setShowBig(false)} month={month} day={day} year={year} left={yesterday} right={tomorrow} jobs={jobForDay} /> : null}
            <Calendar myJobToggle={setOnlyMyJobs} myJobShow={onlyMyJobs} changeMonth={changeMonth} dateArray={dateArray} year={year} month={monthToLetterFull[month]} monthIndex={month} monthJobs={monthJobs} clicked={clicked}/>
        </View>
    )
}