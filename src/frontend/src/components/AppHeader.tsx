import {useState} from "react";
import {AuthModal} from "./AuthModal";
import {RegisterModal} from "./RegisterModal";

type ModalType = "auth" | "register" | null;
type User = {
    name: string,
}

export function AppHeader() {
    const [modal, setModal] = useState<ModalType>(null);
    const [authenticatedUser, setAuthenticatedUser] = useState<User>({name: "тест"});

    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: "20px",
            gap: "10px"}} className="roundedFrame">
            <h1 style={{marginLeft: '15px'}}>Голосование и опросы</h1>
            {authenticatedUser
                ? (
                    <div>
                        <p>{authenticatedUser?.name}</p>
                        <button>Открыть профиль</button>
                    </div>
                )
                : (
                <button onClick={() => setModal("auth")}>Войти</button>
            )}
            {modal === "auth" && (
                <AuthModal
                    onClose={() => setModal(null)}
                    onSwitchToRegister={() => setModal("register")}/>
            )}
            {modal === "register" && (
                <RegisterModal
                    onClose={() => setModal(null)}
                    onSwitchToAuth={() => setModal("auth")}/>
            )}
        </div>
    )
}