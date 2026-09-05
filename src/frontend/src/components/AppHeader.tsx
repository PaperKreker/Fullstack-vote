export function AppHeader() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: "20px",
            gap: "10px"}} className="roundedFrame">
            <h1 style={{marginLeft: '15px'}}>Голосование и опросы</h1>
            <button>Войти</button>
        </div>
    )
}