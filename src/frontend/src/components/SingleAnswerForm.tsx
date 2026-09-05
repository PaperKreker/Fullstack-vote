import {SingleAnswerItem} from "./SingleAnswerItem";
import React from "react";

export function SingleAnswerForm({title, description, answers} : {title: string, description: string, answers: string[]}) {
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("SUBMIT!");
    };

    return (
        <div style={{padding: '0 15px 15px 15px'}} className="roundedFrame">
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