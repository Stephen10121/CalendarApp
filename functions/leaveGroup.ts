import { ParticapantResponse } from "./cancelRequest";
import { POST_SERVER } from "./variables";

interface LeaveGroupResponse extends ParticapantResponse {}

export async function leaveGroup(groupId: string, token: string, transfer: number): Promise<LeaveGroupResponse> {
    try {
        const groups = await fetch(`${POST_SERVER}/leaveGroup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "omit",
            body: JSON.stringify({
                "id": groupId,
                "transfer": transfer.toString()
            })
        });

        const groupsJson = await groups.json();
        if (groupsJson.error) return {error: groupsJson.error}
        return {error: "", message: groupsJson.message}
    } catch (err) {
        console.error(err);
        return {error: "Error leaving Group."};
    }
}