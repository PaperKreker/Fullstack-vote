import {SingleAnswerItem} from "../entities/SingleAnswerItem";
import React, {useState} from "react";
import {checkLogin, checkPassword, checkPoll} from "../shared/Validation";

export function SingleAnswerForm(
    {title, description, answers, isVoted} :
    {title: string, description: string, answers: string[], isVoted: boolean}) {
    const [selected, setSelected] = useState(-1);
    const [errors, setErrors] = useState({answer: ""});

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = {
            answer: checkPoll(isVoted, selected),
        };
        setErrors(newErrors);

        if (newErrors.answer) {
            return;
        }

        console.log(JSON.stringify(selected, null, 2));
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
                    <SingleAnswerItem
                        key={index}
                        id={index}
                        text={answer}
                        onChangeAnswer={setSelected}/>
                ))}
                {errors.answer && <p className={"errorText"}>{errors.answer}</p>}
                <button className={"success"}>Подтвердить</button>
            </form>
        </div>
    )
}
