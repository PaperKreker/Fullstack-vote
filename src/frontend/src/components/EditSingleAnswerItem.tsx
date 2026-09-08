import {CloseButton} from "./CloseButton";
import React from "react";

export function EditSingleAnswerItem(
    {id, answer, onDelete, onChange}:
    {id: number, answer: string, onDelete: (id: number) => void, onChange: (id: number, text: string) => void}) {
    return (
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <input type="radio" name="1"/>
            <input
                type={"text"}
                value={answer}
                placeholder={"..."}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(id, e.target.value)}/>
            <CloseButton onClick={() => onDelete(id)}/>
        </div>
    )
}