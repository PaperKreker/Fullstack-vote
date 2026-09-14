import {useEffect} from "react";
import {CloseButton} from "./CloseButton";

export function Modal({title, onClose, children}:
                      {title: string, onClose: () => void, children: React.ReactNode}) {

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div style={{display: "flex", justifyContent: "space-between",
                    alignItems: "center", width: "100%"}}>
                    <h3>{title}</h3>
                    <CloseButton onClick={onClose}/>
                </div>
                {children}
            </div>
        </div>
    );
}