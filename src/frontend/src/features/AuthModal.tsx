import {InputFieldWithLabel} from "../shared/InputFieldWithLabel";
import React, {useState} from "react";
import {Modal} from "../shared/Modal";
import {checkLogin, checkPassword} from "../shared/Validation";
import {login} from "../shared/ApiRequest";

export function AuthModal(
    {onClose, onSwitchToRegister, onLogin} :
    {onClose: () => void, onSwitchToRegister: () => void, onLogin: (name: string) => void}){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({username: "", password: "", loginError: ""});

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        tryLogin().then();
    }

    async function tryLogin() {
        const usernameError = checkLogin(username);
        const passwordError = checkPassword(password);
        setErrors({username: usernameError, password: passwordError, loginError: ""});

        if (usernameError || passwordError) {
            return;
        }

        const loginSuccessful = await login(username, password);
        if (loginSuccessful) {
            onLogin(username);
        }
        else {
            setErrors({username: usernameError, password: passwordError, loginError: "Данные пользователя неверны"});
        }
    }

    return (
        <Modal
            title={"Авторизация"}
            onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <InputFieldWithLabel
                    label={"Логин"}
                    inputType={"text"}
                    placeholder={"Вася..."}
                    value={username}
                    onChange={setUsername}
                    error={errors?.username}/>
                <InputFieldWithLabel
                    label={"Пароль"}
                    inputType={"password"}
                    placeholder={"********"}
                    value={password}
                    onChange={setPassword}
                    error={errors?.password}/>
                <div style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                    <button className={"success"} type={"submit"}>Войти</button>
                    <button onClick={onSwitchToRegister}>Зарегистрироваться</button>
                </div>
                {errors.loginError && <p className={"errorText"}>{errors.loginError}</p>}
            </form>
        </Modal>
    )
}