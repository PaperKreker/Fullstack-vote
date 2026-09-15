import {SingleAnswerForm} from "../features/SingleAnswerForm";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getPoll} from "../shared/ApiRequest";

type ApiPoll = {
    id: number,
    title: string,
    description: string | null,
    author_id: number,
    is_voted: boolean,
    options: {id: number, option_text: string}[],
}

export function PollPage() {
    const {id} = useParams();
    const [poll, setPoll] = useState<ApiPoll | null>(null);
    const [error, setError] = useState("");
    const [isVoted, setIsVoted] = useState(false);

    useEffect(() => {
        let ignore = false;

        getPoll(Number(id)).then(result => {
            if (!ignore) {
                if (result.success) {
                    setPoll(result.poll);
                    setIsVoted(result.poll.is_voted);
                }
                else {
                    setError(result.error);
                }
            }
        });

        return () => {
            ignore = true;
        };
    }, [id]);

    if (error) {
        return (
            <div className="roundedFrame">
                <h2>Голосование</h2>
                <div className={"line"}/>
                <p>{error}</p>
            </div>
        )
    }

    if (!poll) {
        return (
            <div className="roundedFrame">
                <h2>Голосование</h2>
                <div className={"line"}/>
                <p>Загрузка...</p>
            </div>
        )
    }

    return (
        <SingleAnswerForm
            pollId={poll.id}
            title={poll.title}
            description={poll.description ?? ""}
            answers={poll.options.map(option => ({id: option.id, text: option.option_text}))}
            isVoted={isVoted}
            onVoted={() => setIsVoted(true)}/>
    )
}
