import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthModal} from "./AuthModal";
import {RegisterModal} from "./RegisterModal";

type ModalType = "auth" | "register" | null;

export function AppHeader(
    {authenticatedUser, onLogin} :
    {authenticatedUser: {name: string} | null, onLogin: (name: string) => void}) {
    const navigate = useNavigate();
    const [modal, setModal] = useState<ModalType>(null);

    const handleLogin = (name: string) => {
        onLogin(name);
        setModal(null);
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: "20px",
            gap: "10px"}} className="roundedFrame">
            <h1 style={{marginLeft: '15px'}} onClick={() => navigate("/")}>Голосование и опросы</h1>
            {authenticatedUser
                ? (
                    <div>
                        <p>{authenticatedUser?.name}</p>
                        <button onClick={() => navigate("/profile")}>Открыть профиль</button>
                    </div>
                )
                : (
                <button onClick={() => setModal("auth")}>Войти</button>
            )}
            {modal === "auth" && (
                <AuthModal
                    onClose={() => setModal(null)}
                    onSwitchToRegister={() => setModal("register")}
                    onLogin={handleLogin}/>
            )}
            {modal === "register" && (
                <RegisterModal
                    onClose={() => setModal(null)}
                    onSwitchToAuth={() => setModal("auth")}
                    onLogin={handleLogin}/>
            )}
        </div>
    )
}
