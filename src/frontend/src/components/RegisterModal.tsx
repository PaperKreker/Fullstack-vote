import {InputFieldWithLabel} from "./InputFieldWithLabel";
import {CloseButton} from "./CloseButton";
import {useState} from "react";
import {Modal} from "./Modal";

export function RegisterModal(
    {onClose, onSwitchToAuth} :
    {onClose: () => void, onSwitchToAuth: () => void}){
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    return (
        <Modal
            title={"Регистрация"}
            onClose={onClose}>
            <form>
                <InputFieldWithLabel
                    label={"Логин"}
                    inputType={"text"}
                    placeholder={"Вася..."}
                    value={login}
                    onChange={setLogin}/>
                <InputFieldWithLabel
                    label={"Пароль"}
                    inputType={"password"}
                    placeholder={"********"}
                    value={password}
                    onChange={setPassword}/>
                <InputFieldWithLabel
                    label={"Повторите пароль"}
                    inputType={"password"}
                    placeholder={"********"}
                    value={repeatPassword}
                    onChange={setRepeatPassword}/>
            </form>
            <div style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                <button className={"success"}>Зарегистрироваться</button>
                <button onClick={onSwitchToAuth}>Войти</button>
            </div>
        </Modal>);
}