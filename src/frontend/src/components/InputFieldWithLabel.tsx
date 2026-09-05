export function InputFieldWithLabel(
    {label, inputType, placeholder = "..."} :
    {label: string, inputType: string, placeholder?: string } ) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
            <label style={{margin: "0", width: '75px'}}>{label}</label>
            <input type={inputType} placeholder={placeholder}/>
        </div>
    )
}