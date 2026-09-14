import {InputFieldWithLabel} from "../shared/InputFieldWithLabel";
import {useState} from "react";
import {Modal} from "../shared/Modal";
import {checkLogin, checkPassword, checkPasswordRepeat} from "../shared/Validation";

export function RegisterModal(
    {onClose, onSwitchToAuth, onLogin} :
    {onClose: () => void, onSwitchToAuth: () => void, onLogin: (name: string) => void}){
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errors, setErrors] = useState({login: "", password: "", passwordRepeat: ""});

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = {
            login: checkLogin(login),
            password: checkPassword(password),
            passwordRepeat: checkPasswordRepeat(password, repeatPassword),
        };
        setErrors(newErrors);

        if (newErrors.login || newErrors.password || newErrors.passwordRepeat) {
            return;
        }

        console.log(JSON.stringify({login, password}, null, 2));

        //DEBUG
        onLogin(login);
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
                    <button onClick={onSwitchToAuth}>Войти</button>
                </div>
            </form>
        </Modal>);
}