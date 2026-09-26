import {SingleAnswerForm} from "../features/SingleAnswerForm";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getPoll} from "../shared/ApiRequest";

type ApiPoll = {
    code: string,
    title: string,
    description: string | null,
    author_id: number,
    is_voted: boolean,
    options: {id: number, option_text: string}[],
}

export function PollPage() {
    const {code} = useParams();
    const [poll, setPoll] = useState<ApiPoll | null>(null);
    const [error, setError] = useState("");
    const [isVoted, setIsVoted] = useState(false);

    useEffect(() => {
        let ignore = false;

        getPoll(String(code)).then(result => {
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
    }, [code]);

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
            code={poll.code}
            title={poll.title}
            description={poll.description ?? ""}
            answers={poll.options.map(option => ({id: option.id, text: option.option_text}))}
            isVoted={isVoted}
            onVoted={() => setIsVoted(true)}/>
    )
}
