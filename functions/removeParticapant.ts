import { ParticapantResponse } from "./cancelRequest";
import { POST_SERVER } from "./variables";

interface RemoveParticapantResponse extends ParticapantResponse {}

export async function removeParticapant(groupId: string, token: string, particapant: string): Promise<RemoveParticapantResponse> {
    try {
        const groups = await fetch(`${POST_SERVER}/kickUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "omit",
            body: JSON.stringify({
                "id": groupId,
                "particapant": particapant
            })
        });
        const groupsJson = await groups.json();
        
        if (groupsJson.error) return {error: groupsJson.error}
        return {error: "", message: groupsJson}
    } catch (err) {
        console.error(err);
        return {error: "Error Deleting Particapant."};
    }
}