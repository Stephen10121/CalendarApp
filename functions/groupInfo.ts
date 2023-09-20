import { POST_SERVER } from "./variables";

export interface Particapant {
    name: string;
    id: number;
}

export interface GroupInfoData {
    about_group: string;
    created: string;
    group_id: string;
    name: string;
    owner: string;
    owner_email: string;
    particapants: Particapant[];
    yourowner?: {
    ownerId: number;
    pending_particapants: Particapant[];
}
}

export interface GroupInfoResponse {
    error: string;
    data?: GroupInfoData;
}

export async function groupInfo(groupId: string, token: string): Promise<GroupInfoResponse> {
    try {
        const groups = await fetch(`${POST_SERVER}/groupInfo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "omit",
            body: JSON.stringify({
                "groupId": groupId,
            })
        });

        const groupsJson = await groups.json();
        if (groupsJson.error) return {error: groupsJson.error}
        return {error: "", data: groupsJson}
    } catch (err) {
        console.error(err);
        return {error: "Error Getting Group Data."};
    }
}