export function Components() {
    return (
        <div className="App">
            <h1>H1 Заголовок</h1>
            <h2>H2 Заголовок</h2>
            <h3>H3 Заголовок</h3>
            <h4>H4 Заголовок</h4>
            <p>Тестовый параграф</p>
            <button>Тестовая кнопа</button>
            <button className={"success"}>Успех</button>
            <button className={"error"}>Ошибка</button>
            <div style={{marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '5px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <input type="checkbox"/>
                    <label>Первый вариант</label>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <input type="checkbox"/>
                    <label>Второй вариант</label>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <input type="radio" name="1"/>
                    <label>Первый вариант</label>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <input type="radio" name="1"/>
                    <label>Второй вариант</label>
                </div>
            </div>
        </div>
    )
}