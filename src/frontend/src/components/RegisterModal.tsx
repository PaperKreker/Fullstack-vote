import {InputFieldWithLabel} from "./InputFieldWithLabel";
import {CloseButton} from "./CloseButton";

export function RegisterModal() {
    return (
        <div className={"modal-overlay"}>
            <div className={"modal"}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
                    <h3>Регистрация</h3>
                    <CloseButton/>
                </div>
                <form>
                    <InputFieldWithLabel label={"Логин"} inputType={"text"} placeholder={"Вася..."}/>
                    <InputFieldWithLabel label={"Пароль"} inputType={"password"} placeholder={"********"}/>
                    <InputFieldWithLabel label={"Повторите пароль"} inputType={"password"} placeholder={"********"}/>
                </form>
                <button className={"success"}>Зарегистрироваться</button>
            </div>
        </div>
    )
}