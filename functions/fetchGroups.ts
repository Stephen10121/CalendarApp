import { POST_SERVER } from "./variables";

export type PendingGroupsType = {
    groupId: string;
    groupName: string;
}

export type GroupsType = {
    groupId: string;
    groupName: string;
    groupOwner: string;
    othersCanAdd: boolean;
    youOwn: boolean;
    notification?: boolean;
}

export interface FetchGroupsResponse {
    error: string;
    data?: {
        groups: GroupsType[];
        pendingGroups: PendingGroupsType[];
    };
}

export async function fetchGroups(token: string): Promise<FetchGroupsResponse> {
    const groups = await fetch(`${POST_SERVER}/myGroups`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        credentials: "omit"
    });
    
    try {
        const groupsJson = await groups.json();
        if (groupsJson.error) return {error: groupsJson.error}
        return { error: "", data: { groups: groupsJson.groups, pendingGroups: groupsJson.pendingGroups} }
    } catch (err) {
        console.error(err);
        return { error: "Couldnt fetch the groups." }
    }
}