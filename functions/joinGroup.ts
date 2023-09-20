import { POST_SERVER } from "./variables";

export interface JoinGroupResponse {
	error: string;
	message?: string;
	groupName?: string;
}

export async function joinGroup(groupId: string, password: string, token: string): Promise<JoinGroupResponse> {
	try {
		const groups = await fetch(`${POST_SERVER}/joinGroup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
			credentials: "omit",
			body: JSON.stringify({
				"id": groupId,
				"password": password
			})
		});

		const groupsJson = await groups.json();
		
		if (groupsJson.error) return {error: groupsJson.error}
		return {error: "", message: groupsJson.message, groupName: groupsJson.groupName}
	} catch (err) {
		console.error(err);
		return {error: "Error Joining Group."};
	}
}