import {InputFieldWithLabel} from "../shared/InputFieldWithLabel";
import React, {useState} from "react";
import {Modal} from "../shared/Modal";
import {checkLogin, checkPassword, checkPasswordRepeat} from "../shared/Validation";
import {register} from "../shared/ApiRequest";

export function RegisterModal(
    {onClose, onSwitchToAuth, onLogin} :
    {onClose: () => void, onSwitchToAuth: () => void, onLogin: (name: string) => void}){
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errors, setErrors] = useState({login: "", password: "", passwordRepeat: "", registerError: ""});

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        tryRegister().then();
    }

    async function tryRegister() {
        const loginError = checkLogin(login);
        const passwordError = checkPassword(password);
        const passwordRepeatError = checkPasswordRepeat(password, repeatPassword);
        setErrors({login: loginError, password: passwordError, passwordRepeat: passwordRepeatError, registerError: ""});

        if (loginError || passwordError || passwordRepeatError) {
            return;
        }

        const result = await register(login, password);
        if (result.success) {
            onLogin(login);
        }
        else {
            setErrors({
                login: loginError,
                password: passwordError,
                passwordRepeat: passwordRepeatError,
                registerError: result.error});
        }
    }

    return (
        <Modal
            title={"Регистрация"}
            onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <InputFieldWithLabel
                    label={"Логин"}
                    inputType={"text"}
                    placeholder={"Вася..."}
                    value={login}
                    onChange={setLogin}
                    error={errors.login}/>
                <InputFieldWithLabel
                    label={"Пароль"}
                    inputType={"password"}
                    placeholder={"********"}
                    value={password}
                    onChange={setPassword}
                    error={errors.password}/>
                <InputFieldWithLabel
                    label={"Повторите пароль"}
                    inputType={"password"}
                    placeholder={"********"}
                    value={repeatPassword}
                    onChange={setRepeatPassword}
                    error={errors.passwordRepeat}/>
                <div style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                    <button className={"success"} type={"submit"}>Зарегистрироваться</button>
                    <button type={"button"} onClick={onSwitchToAuth}>Войти</button>
                </div>
                {errors.registerError && <p className={"errorText"}>{errors.registerError}</p>}
            </form>
        </Modal>);
}