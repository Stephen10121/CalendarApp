import { POST_SERVER } from "./variables";

export interface JobType {
    CreatedAt: string;
    DeletedAt: string;
    ID: number;
    client: string;
    address: string;
    volunteer: string;
    month: number;
    day: number;
    year: number;
    hour: number;
    minute: number;
    pm: boolean;
    jobTitle: string;
    groupId: string;
    instructions: string;
    groupName: string;
    issuer: number;
    issuerName: string;
    taken: boolean;
    positions: number;
}

export interface GetJobsByDatesResponse {
    jobs?: any;
    error?: string;
}

export async function getJobsByDates(token: string, months: number[], year: number): Promise<GetJobsByDatesResponse> {
    const groups = await fetch(`${POST_SERVER}/allJobsByMonthsYear`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: "omit",
        body: JSON.stringify({
            "months": JSON.stringify(months),
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