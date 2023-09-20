import { ParticapantResponse } from "./cancelRequest";
import { POST_SERVER } from "./variables";

interface DeleteGroupResponse extends ParticapantResponse {}

export async function deleteGroup(groupId: string, token: string): Promise<DeleteGroupResponse> {
    try {
        const groups = await fetch(`${POST_SERVER}/deleteGroup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "omit",
            body: JSON.stringify({
                "id": groupId
            })
        });

        const groupsJson = await groups.json();
        
        if (groupsJson.error) return {error: groupsJson.error}
        return {error: "", message: groupsJson.message}
    } catch (err) {
        console.error(err);
        return {error: "Error deleting Group."};
    }
}