import {deleteToken, getToken, saveToken} from "./Token";

const API_URL = "http://" + window.location.hostname + ":8000";

let onSessionExpired = () => {};
let refreshRequest: Promise<boolean> | null = null;

export function setOnSessionExpired(handler: () => void) {
    onSessionExpired = handler;
}

const isSessionExpired = (response: Response) => {
    if (response.status === 401) {
        deleteToken();
        onSessionExpired();
        return true;
    }
    return false;
};

const getErrorMessage = async (response: Response, defaultMessage: string) => {
    try {
        const data = await response.json();
        if (typeof data.detail === "string") {
            return data.detail;
        }
    }
    catch (e) {
    }
    return defaultMessage;
};

const askForNewToken = async () => {
    try {
        const response = await fetch(API_URL + "/refresh", {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            deleteToken();
            return false;
        }

        const data = await response.json();
        saveToken(data.access_token);
        return true;

    } catch (e) {
        return false;
    }
};

const refreshAccessToken = () => {
    if (!refreshRequest) {
        refreshRequest = askForNewToken().then(result => {
            refreshRequest = null;
            return result;
        });
    }
    return refreshRequest;
};

const authorizedFetch = async (url: string, method: string = "GET", body: object | null = null) => {
    const headers: Record<string, string> = {"Authorization": "Bearer " + getToken()};

    if (body) {
        headers["Content-Type"] = "application/json";
    }

    const options: RequestInit = {
        method: method,
        headers: headers,
        credentials: "include",
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    let response = await fetch(url, options);

    if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            headers["Authorization"] = "Bearer " + getToken();
            response = await fetch(url, options);
        }
    }

    return response;
};

export const login = async (username: string, password: string) => {
    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);

    try {
        const response = await fetch(API_URL + "/token", {
            method: "POST",
            credentials: "include",
            body: body,
        });

        if (!response.ok) {
            return {success: false, error: await getErrorMessage(response, "Не удалось войти")};
        }

        const data = await response.json();
        saveToken(data.access_token);
        return {success: true, error: ""};

    } catch (e) {
        return {success: false, error: "Не удалось связаться с сервером"};
    }
};

export const register = async (username: string, password: string) => {
    try {
        const response = await fetch(API_URL + "/user/add/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: username, password: password}),
        });

        if (!response.ok) {
            return {success: false, error: await getErrorMessage(response, "Не удалось зарегистрироваться")};
        }

        const loginResult = await login(username, password);
        if (!loginResult.success) {
            return {success: false, error: "Аккаунт создан, но войти не получилось"};
        }

        return {success: true, error: ""};

    } catch (e) {
        return {success: false, error: "Не удалось связаться с сервером"};
    }
};

export const logout = async () => {
    try {
        await fetch(API_URL + "/logout", {method: "POST", credentials: "include"});
    }
    catch (e) {
    }
    deleteToken();
};

export const restoreSession = async () => {
    const refreshed = await refreshAccessToken();

    if (!refreshed) {
        return null;
    }

    return getMe();
};

export const getMe = async () => {
    if (!getToken()) {
        return null;
    }

    try {
        const response = await authorizedFetch(API_URL + "/me/");

        if (!response.ok) {
            isSessionExpired(response);
            return null;
        }

        return await response.json();

    } catch (e) {
        console.log("Не удалось связаться с сервером");
        return null;
    }
};

export const getMyPolls = async () => {
    if (!getToken()) {
        return null;
    }

    try {
        const response = await authorizedFetch(API_URL + "/my/polls/");

        if (!response.ok) {
            isSessionExpired(response);
            return null;
        }

        return await response.json();

    } catch (e) {
        console.log("Не удалось связаться с сервером");
        return null;
    }
};

export const getPoll = async (id: number) => {
    if (!getToken()) {
        return {success: false, error: "Чтобы открыть голосование, нужно зайти в аккаунт.", poll: null};
    }

    try {
        const response = await authorizedFetch(API_URL + "/poll/?poll_id=" + id);

        if (!response.ok) {
            if (isSessionExpired(response)) {
                return {success: false, error: "Сессия истекла, зайдите в аккаунт заново.", poll: null};
            }
            return {success: false, error: await getErrorMessage(response, "Не удалось открыть голосование"), poll: null};
        }

        return {success: true, error: "", poll: await response.json()};

    } catch (e) {
        return {success: false, error: "Не удалось связаться с сервером", poll: null};
    }
};

export const createPoll = async (title: string, description: string, answers: string[]) => {
    if (!getToken()) {
        return {success: false, error: "Чтобы создать голосование, нужно зайти в аккаунт."};
    }

    try {
        const response = await authorizedFetch(API_URL + "/poll/add/", "POST", {
            title: title,
            description: description,
            answers: answers,
        });

        if (!response.ok) {
            if (isSessionExpired(response)) {
                return {success: false, error: "Сессия истекла, зайдите в аккаунт заново."};
            }
            return {success: false, error: await getErrorMessage(response, "Не удалось создать голосование")};
        }

        return {success: true, error: ""};

    } catch (e) {
        return {success: false, error: "Не удалось связаться с сервером"};
    }
};

export const deletePoll = async (id: number) => {
    if (!getToken()) {
        return {success: false, error: "Чтобы удалить голосование, нужно зайти в аккаунт."};
    }

    try {
        const response = await authorizedFetch(API_URL + "/poll/", "DELETE", {poll_id: id});

        if (!response.ok) {
            if (isSessionExpired(response)) {
                return {success: false, error: "Сессия истекла, зайдите в аккаунт заново."};
            }
            return {success: false, error: await getErrorMessage(response, "Не удалось удалить голосование")};
        }

        return {success: true, error: ""};

    } catch (e) {
        return {success: false, error: "Не удалось связаться с сервером"};
    }
};

export const voteInPoll = async (pollId: number, optionId: number) => {
    if (!getToken()) {
        return {success: false, error: "Чтобы проголосовать, нужно зайти в аккаунт."};
    }

    try {
        const response = await authorizedFetch(API_URL + "/poll/vote/", "POST", {
            poll_id: pollId,
            option_id: optionId,
        });

        if (!response.ok) {
            if (isSessionExpired(response)) {
                return {success: false, error: "Сессия истекла, зайдите в аккаунт заново."};
            }
            return {success: false, error: await getErrorMessage(response, "Не удалось проголосовать")};
        }

        return {success: true, error: ""};

    } catch (e) {
        return {success: false, error: "Не удалось связаться с сервером"};
    }
};
