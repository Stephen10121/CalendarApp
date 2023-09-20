import { POST_SERVER } from "./variables";

export type GroupsType = {
	groupId: string;
	groupName: string;
	groupOwner: string;
	othersCanAdd: boolean;
	youOwn: boolean;
	notification?: boolean;
}

interface CreateGroupResponse {
	error?: string;
	data?: GroupsType;
}

export async function createGroup(groupId: string, groupName: string, password: string, othersCanAdd: boolean, about_group: string, token: string): Promise<CreateGroupResponse> {
	try {
		const groups = await fetch(`${POST_SERVER}/createGroup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
			credentials: "omit",
			body: JSON.stringify({
				"name": groupName,
				"id": groupId,
				"password": password,
				"othersCanAdd": othersCanAdd,
				"aboutGroup": about_group
			})
		});

		const groupsJson = await groups.json();
		
		if (groupsJson.error) return {error: groupsJson.error}
		return {error: "", data: groupsJson.data}
	} catch (err) {
		console.error(err);
		return {error: "Error Joining Group."};
	}
}