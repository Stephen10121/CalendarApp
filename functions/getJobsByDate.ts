import { JobType } from "./getJobsByDates";
import { POST_SERVER } from "./variables";

export interface GetJobsByDateResponse {
    jobs?: JobType[];
    error?: string;
}

export async function getJobsByDate(token: string, month: number, year: number): Promise<GetJobsByDateResponse> {
    if (month < 1) return { error: "Month out of range." }
    if (month > 12) return { error: "Month out of range." }

    const groups = await fetch(`${POST_SERVER}/getAllJobsByMonthYear`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: "omit",
        body: JSON.stringify({
            "month": month,
            "year": year
        })
    });

    try {
        const groupsJson = await groups.json();

        if (groupsJson.error) return {error: groupsJson.error}
        return {jobs: groupsJson.jobs}
    } catch (err) {
        console.error(err);
        return { error: "Couldnt fetch the jobs." }
    }
}