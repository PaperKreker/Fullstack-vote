export function SingleAnswerItem(
    {text, id, onChangeAnswer}:
    {text: string, id: number, onChangeAnswer: (id: number) => void} ) {
    return (
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <input onChange={() => (onChangeAnswer(id))} type="radio" name="answer"/>
            <label>{ text }</label>
        </div>
    )
}