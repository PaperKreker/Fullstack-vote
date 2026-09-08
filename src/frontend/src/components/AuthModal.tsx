import {InputFieldWithLabel} from "./InputFieldWithLabel";
import {useState} from "react";
import {Modal} from "./Modal";

export function AuthModal(
    {onClose, onSwitchToRegister} :
    {onClose: () => void, onSwitchToRegister: () => void}){
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Modal
            title={"Авторизация"}
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
            </form>
            <div style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                <button className={"success"}>Войти</button>
                <button onClick={onSwitchToRegister}>Зарегистрироваться</button>
            </div>
        </Modal>
    )
}