export function checkLogin(login: string) {
    if (login.length < 3) {
        return "Логин должен быть минимум 3 символа";
    }
    if (login.includes(" ")) {
        return "Логин не должен содержать пробелов";
    }
    return "";
}

export function checkPassword(password: string) {
    if (password.length < 8) {
        return "Пароль должен быть минимум 8 символов";
    }
    return "";
}

export function checkPasswordRepeat(password: string, passwordRepeat: string) {
    if (password !== passwordRepeat) {
        return "Пароли должны совпадать";
    }
    return "";
}

export function checkTitle(title: string) {
    if (title.length === 0) {
        return "Заголовок не должен быть пустым";
    }
    return "";
}

export function checkAnswers(answers: string[]) {
    if (answers.length <= 1) {
        return "Должно быть 2 или больше вариантов";
    }
    for (let i = 0; i < answers.length - 1; i++) {
        for (let j = i + 1; j < answers.length; j++) {
            if (answers[i] === answers[j] && answers[i].length > 0) {
                return "Варианты ответа не должны совпадать";
            }
        }
    }
    return "";
}

export function checkEachAnswer(answers: string[]) {
    let messages: string[] = [];
    let hasError = false;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].length === 0) {
            messages.push("Вариант ответа не должен быть пустым");
            hasError = true;
        }
        else {
            messages.push("");
        }
    }
    return {result: messages, hasError: hasError};
}

export function checkPoll(isVoted: boolean, answer: number) {
    if (isVoted) {
        return "Вы уже проголосовали";
    }
    if (answer === -1) {
        return "Необходимо выбрать вариант ответа";
    }
    return "";
}

