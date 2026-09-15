import {deleteToken, getToken, saveToken} from "./Token";

const API_URL = "http://127.0.0.1:8000";

let onSessionExpired = () => {};

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

export const login = async (username: string, password: string) => {
    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);

    try {
        const response = await fetch(API_URL + "/token", {method: "POST", body: body});

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
    const token = getToken();

    if (!token) {
        return null;
    }

    try {
        const response = await fetch(API_URL + "/my/polls/", {
            headers: {"Authorization": "Bearer " + token},
        });

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
    const token = getToken();

    if (!token) {
        return {success: false, error: "Чтобы открыть голосование, нужно зайти в аккаунт.", poll: null};
    }

    try {
        const response = await fetch(API_URL + "/poll/?poll_id=" + id, {
            headers: {"Authorization": "Bearer " + token},
        });

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
    const token = getToken();

    if (!token) {
        return {success: false, error: "Чтобы создать голосование, нужно зайти в аккаунт."};
    }

    try {
        const response = await fetch(API_URL + "/poll/add/", {
            method: "POST",
            headers: {"Content-Type": "application/json", "Authorization": "Bearer " + token},
            body: JSON.stringify({title: title, description: description, answers: answers}),
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
    const token = getToken();

    if (!token) {
        return {success: false, error: "Чтобы удалить голосование, нужно зайти в аккаунт."};
    }

    try {
        const response = await fetch(API_URL + "/poll/", {
            method: "DELETE",
            headers: {"Content-Type": "application/json", "Authorization": "Bearer " + token},
            body: JSON.stringify({poll_id: id}),
        });

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
    const token = getToken();

    if (!token) {
        return {success: false, error: "Чтобы проголосовать, нужно зайти в аккаунт."};
    }

    try {
        const response = await fetch(API_URL + "/poll/vote/", {
            method: "POST",
            headers: {"Content-Type": "application/json", "Authorization": "Bearer " + token},
            body: JSON.stringify({poll_id: pollId, option_id: optionId}),
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
