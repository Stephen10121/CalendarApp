import { POST_SERVER } from "./variables";

export interface GoogleLoginData {
    CreatedAt: string;
    DeletedAt: string;
    ID: number;
    UpdatedAt: string;
    email: string;
    googId: string;
    firstName: string;
    lastName: string;
    name: string;
    groups: string;
    pendingGroups: string;
    locale: string;
    picture: string;
    verifiedEmail: string;
}

export interface ValidateResponse {
    error: boolean;
    data?: {
        userData: GoogleLoginData;
    };
}

export async function fetchUser(token: string): Promise<ValidateResponse> {
    try {
      const groups = await fetch(`${POST_SERVER}/validate`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        credentials: "omit"
      })
      const groupsJson = await groups.json();
      if (groupsJson.error) {
        return {error: true}
      }
      return {error: false, data: groupsJson.data}
    } catch (err) {
      console.error(err);
      return {error: true};
    }
}