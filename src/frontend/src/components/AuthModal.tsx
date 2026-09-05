import {InputFieldWithLabel} from "./InputFieldWithLabel";
import {CloseButton} from "./CloseButton";

export function AuthModal() {
    return (
        <div className={"modal-overlay"}>
            <div className={"modal"}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
                    <h3>Авторизация</h3>
                    <CloseButton/>
                </div>
                <form>
                    <InputFieldWithLabel label={"Логин"} inputType={"text"} placeholder={"Вася..."}/>
                    <InputFieldWithLabel label={"Пароль"} inputType={"password"} placeholder={"********"}/>
                </form>
                <button className={"success"}>Войти</button>
            </div>
        </div>
    )
}