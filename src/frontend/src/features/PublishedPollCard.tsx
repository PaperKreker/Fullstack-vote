import {useNavigate} from "react-router-dom";
import {CloseButton} from "../shared/CloseButton";
import {PollResultItem} from "../entities/PollResultItem";

export function PublishedPollCard(
    {id, code, title, description, answers, votes, onDelete} :
    {id: number, code: string, title: string, description: string, answers: string[], votes: number[], onDelete: (id: number) => void}) {
    const navigate = useNavigate();

    let allVotes = 0;
    for (let i = 0; i < votes.length; i++) {
        allVotes = allVotes + votes[i];
    }

    return (
        <div className="roundedFrame">
            <div style={{
                width: "100%",
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '10px'}}>
                <div style={{minWidth: 0, overflowWrap: "break-word"}}>
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>
                <div style={{marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <button onClick={() => navigate("/poll/" + code)}>Открыть</button>
                    <CloseButton onClick={() => onDelete(id)}/>
                </div>
            </div>
            <div className={"line"}/>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {answers.map((answer, index) => (
                    <PollResultItem key={index} text={answer} votes={votes[index]} allVotes={allVotes}/>
                ))}
            </div>
            <div className={"line"}/>
            <p><b>Всего голосов:</b> {allVotes}</p>
        </div>
    )
}
