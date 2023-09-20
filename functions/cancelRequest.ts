import { POST_SERVER } from "./variables";

export interface ParticapantResponse {
    message?: string;
    error?: string;
}

interface CancelRequestResponse extends ParticapantResponse {}

export async function cancelRequest(groupId: string, token: string): Promise<CancelRequestResponse> {
    try {
        const groups = await fetch(`${POST_SERVER}/cancelRequest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "omit",
            body: JSON.stringify({
                "id": groupId,
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