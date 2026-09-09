import {useNavigate} from "react-router-dom";
import {CloseButton} from "./CloseButton";
import {VoteResultItem} from "./VoteResultItem";

export function PublishedVoteItem(
    {id, title, description, answers, votes, onDelete} :
    {id: number, title: string, description: string, answers: string[], votes: number[], onDelete: (id: number) => void}) {
    const navigate = useNavigate();

    let allVotes = 0;
    for (let i = 0; i < votes.length; i++) {
        allVotes = allVotes + votes[i];
    }

    return (
        <div className="roundedFrame">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px'}}>
                <div>
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <button onClick={() => navigate("/vote/" + id)}>Открыть</button>
                    <CloseButton onClick={() => onDelete(id)}/>
                </div>
            </div>
            <div className={"line"}/>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {answers.map((answer, index) => (
                    <VoteResultItem key={index} text={answer} votes={votes[index]} allVotes={allVotes}/>
                ))}
            </div>
            <div className={"line"}/>
            <p><b>Всего голосов:</b> {allVotes}</p>
        </div>
    )
}
