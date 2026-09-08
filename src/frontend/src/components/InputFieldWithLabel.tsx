import React from "react";

export function InputFieldWithLabel(
    {label, inputType, placeholder = "...", value, onChange} :
    {label: string, inputType: string, placeholder?: string, value: string, onChange: (value: string) => void} ) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
            <label style={{margin: "0", width: '75px'}}>{label}</label>
            <input
                type={inputType}
                placeholder={placeholder}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}/>
        </div>
    )
}