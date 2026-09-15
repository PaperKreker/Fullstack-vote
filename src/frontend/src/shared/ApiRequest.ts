import {deleteToken, getToken, saveToken} from "./Token";

const API_URL = "http://127.0.0.1:8000";

export const login = async (username: string, password: string) => {
    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);

    try {
        const response = await fetch(API_URL + "/token", {method: "POST", body: body});

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        saveToken(data.access_token);
        return true;

    } catch (e) {
        console.log("Не удалось связаться с сервером");
        return false;
    }
};

export const getMe = async () => {
    const token = getToken();

    if (!token) {
        return null;
    }

    try {
        const response = await fetch(API_URL + "/me/", {
            headers: {"Authorization": "Bearer " + token},
        });

        if (!response.ok) {
            deleteToken();
            return null;
        }

        return await response.json();

    } catch (e) {
        console.log("Не удалось связаться с сервером");
        return null;
    }
};
