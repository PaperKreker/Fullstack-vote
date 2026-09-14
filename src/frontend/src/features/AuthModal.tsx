import {InputFieldWithLabel} from "../shared/InputFieldWithLabel";
import {useState} from "react";
import {Modal} from "../shared/Modal";
import {checkLogin, checkPassword} from "../shared/Validation";

export function AuthModal(
    {onClose, onSwitchToRegister, onLogin} :
    {onClose: () => void, onSwitchToRegister: () => void, onLogin: (name: string) => void}){
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({login: "", password: ""});

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = {
            login: checkLogin(login),
            password: checkPassword(password),
        };
        setErrors(newErrors);

        if (newErrors.login || newErrors.password) {
            return;
        }

        console.log(JSON.stringify({login, password}, null, 2));

        // DEBUG
        onLogin(login);
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
                    value={login}
                    onChange={setLogin}
                    error={errors?.login}/>
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
            </form>
        </Modal>
    )
}