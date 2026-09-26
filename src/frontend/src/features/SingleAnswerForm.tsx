import {SingleAnswerItem} from "../entities/SingleAnswerItem";
import React, {useState} from "react";
import {checkPoll} from "../shared/Validation";
import {voteInPoll} from "../shared/ApiRequest";

export function SingleAnswerForm(
    {code, title, description, answers, isVoted, onVoted} :
    {code: string, title: string, description: string, answers: {id: number, text: string}[], isVoted: boolean, onVoted: () => void}) {
    const [selected, setSelected] = useState(-1);
    const [errors, setErrors] = useState({answer: ""});

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        tryVote().then();
    };

    async function tryVote() {
        const answerError = checkPoll(isVoted, selected);
        setErrors({answer: answerError});

        if (answerError) {
            return;
        }

        const result = await voteInPoll(code, selected);
        if (result.success) {
            onVoted();
        }
        else {
            setErrors({answer: result.error});
        }
    }

    if (isVoted) {
        return (
            <div className="roundedFrame">
                <h2>{title}</h2>
                <div className={"line"}></div>
                <p>Ваш голос отправлен</p>
            </div>
        )
    }

    return (
        <div className="roundedFrame">
            <h2>{title}</h2>
            <p>{description}</p>
            <div className={"line"}></div>
            <form onSubmit={handleSubmit}>
                {answers.map(answer => (
                    <SingleAnswerItem
                        key={answer.id}
                        id={answer.id}
                        text={answer.text}
                        onChangeAnswer={setSelected}/>
                ))}
                {errors.answer && <p className={"errorText"}>{errors.answer}</p>}
                <button className={"success"}>Подтвердить</button>
            </form>
        </div>
    )
}
