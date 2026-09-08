import {useState} from "react";
import {AppHeader} from "../components/AppHeader";
import {PublishedVoteItem} from "../components/PublishedVoteItem";

export function ProfilePage({onOpenProfile, onCreateVote, onLogout} : {onOpenProfile: () => void, onCreateVote: () => void, onLogout: () => void}) {
    const name = "тест";
    const [publishedVotes, setPublishedVotes] = useState([
        {title: "Сколько?", description: "Тестовое описание первого голосования"},
        {title: "Какой цвет лучше?", description: "Тестовое описание второго голосования"},
        {title: "Куда пойдём?", description: "Тестовое описание третьего голосования"},
    ]);

    const deleteVote = (id: number) => {
        setPublishedVotes(prevVotes => {
            const nextVotes = [...prevVotes];
            nextVotes.splice(id, 1);
            return nextVotes;
        });
    };

    return (
        <div className="App">
            <AppHeader onOpenProfile={onOpenProfile}/>
            <div style={{padding: '0 15px 15px 15px'}} className="roundedFrame">
                <h2>Профиль</h2>
                <p><b>Логин:</b> {name}</p>
                <div className={"line"}/>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button className={"error"} onClick={onLogout}>Выйти</button>
                </div>
            </div>
            <div style={{padding: '0 15px 15px 15px'}} className="roundedFrame">
                <h2>Мои голосования</h2>
                <button className={"success"} onClick={onCreateVote}>Создать голосование</button>
                <div className={"line"}/>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    {publishedVotes.map((vote, index) => (
                        <PublishedVoteItem
                            key={index}
                            id={index}
                            title={vote.title}
                            description={vote.description}
                            onDelete={deleteVote}/>
                    ))}
                </div>
            </div>
        </div>
    )
}
