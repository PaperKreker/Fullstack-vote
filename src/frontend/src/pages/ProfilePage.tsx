import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {PublishedPollCard} from "../features/PublishedPollCard";
import {deletePoll, getMyPolls} from "../shared/ApiRequest";

type ApiPollWithResults = {
    id: number,
    title: string,
    description: string | null,
    total_votes: number,
    results: {id: number, option_text: string, votes: number}[],
}

type PublishedPoll = {
    id: number,
    title: string,
    description: string,
    answers: string[],
    votes: number[],
}

export function ProfilePage(
    {authenticatedUser, onLogout} :
    {authenticatedUser: {name: string} | null, onLogout: () => void}) {
    const navigate = useNavigate();
    const [publishedPolls, setPublishedPolls] = useState<PublishedPoll[]>([]);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        let ignore = false;

        getMyPolls().then(polls => {
            if (!ignore && polls) {
                setPublishedPolls(polls.map((poll: ApiPollWithResults) => ({
                    id: poll.id,
                    title: poll.title,
                    description: poll.description ?? "",
                    answers: poll.results.map(result => result.option_text),
                    votes: poll.results.map(result => result.votes),
                })));
            }
        });

        return () => {
            ignore = true;
        };
    }, []);

    const handleDeletePoll = (id: number) => {
        deletePoll(id).then(result => {
            if (result.success) {
                setDeleteError("");
                setPublishedPolls(prevPolls => prevPolls.filter(poll => poll.id !== id));
            }
            else {
                setDeleteError(result.error);
            }
        });
    };

    const handleLogout = () => {
        onLogout();
        navigate("/");
    };

    if (!authenticatedUser) {
        return (
            <div className="roundedFrame">
                <h2>Профиль</h2>
                <p>Чтобы посмотреть профиль, нужно зайти в аккаунт.</p>
                <p>Нажмите кнопку «Войти» сверху справа.</p>
            </div>
        )
    }

    return (
        <>
            <div className="roundedFrame">
                <h2>Профиль</h2>
                <p><b>Логин:</b> {authenticatedUser.name}</p>
                <div className={"line"}/>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button className={"error"} onClick={handleLogout}>Выйти</button>
                </div>
            </div>
            <div className="roundedFrame">
                <h2>Мои голосования</h2>
                <button className={"success"} onClick={() => navigate("/create")}>Создать голосование</button>
                <div className={"line"}/>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    {publishedPolls.map(poll => (
                        <PublishedPollCard
                            key={poll.id}
                            id={poll.id}
                            title={poll.title}
                            description={poll.description}
                            answers={poll.answers}
                            votes={poll.votes}
                            onDelete={handleDeletePoll}/>
                    ))}
                </div>
                {deleteError && <p className={"errorText"}>{deleteError}</p>}
            </div>
        </>
    )
}
