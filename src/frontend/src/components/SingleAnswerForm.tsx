import {SingleAnswerItem} from "./SingleAnswerItem";
import React from "react";

export function SingleAnswerForm(
    {title, description, answers, isVoted} :
    {title: string, description: string, answers: string[], isVoted: boolean}) {
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("SUBMIT!");
    };

    if (isVoted) {
        return (
            <div className="roundedFrame">
                <h2>{title}</h2>
                <div className={"line"}></div>
                <p><b>Ваш голос отправлен</b></p>
            </div>
        )
    }

    return (
        <div className="roundedFrame">
            <h2>{title}</h2>
            <p>{description}</p>
            <div className={"line"}></div>
            <form onSubmit={handleSubmit}>
                {answers.map((answer, index) => (
                    <SingleAnswerItem key={index} text={answer}/>
                ))}
                <button className={"success"}>Подтвердить</button>
            </form>
        </div>
    )
}
