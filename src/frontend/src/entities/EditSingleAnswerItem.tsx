import {CloseButton} from "../shared/CloseButton";
import React from "react";

export function EditSingleAnswerItem(
    {id, answer, onDelete, onChange, error}:
    {id: number, answer: string, onDelete: (id: number) => void, onChange: (id: number, text: string) => void, error?: string}) {
    return (
        <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <input type="radio" name="1"/>
                <input
                    className={error ? "inputError" : ""}
                    type={"text"}
                    value={answer}
                    placeholder={"..."}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(id, e.target.value)}/>
                <CloseButton onClick={() => onDelete(id)}/>
            </div>
            {error && <p className={"errorText"}>{error}</p>}
        </div>
    )
}