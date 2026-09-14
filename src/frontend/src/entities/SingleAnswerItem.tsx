export function SingleAnswerItem( {text}: {text: string} ) {
    return (
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <input type="radio" name="1"/>
            <label>{ text }</label>
        </div>
    )
}