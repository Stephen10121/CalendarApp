import { GoogleLoginData } from "./fetchUser";
import { POST_SERVER } from "./variables";


export async function googleLoginOrRegister(accessToken: string): Promise<{ error: true, errorMessage: string } | { error: false
    data: {
        userData: GoogleLoginData,
        token: string
    }
}> {
    try {
        const groups = await fetch(`${POST_SERVER}/google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "omit",
            body: JSON.stringify({"token": accessToken})
        });

        const groupsJson = await groups.json();

        if (groupsJson.error !== "" || !groupsJson.data) return { error: true, errorMessage: "Error logging in user." }

        return { error: false, data: { userData: groupsJson.data.userData, token: groupsJson.data.token} }
    } catch (err) {
        console.error(err);
        return { error: true, errorMessage: "Error logging in user." }
    }
}