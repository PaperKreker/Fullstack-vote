import React from "react";
import { useState } from "react";
import {InputFieldWithLabel} from "./InputFieldWithLabel";
import {EditSingleAnswerItem} from "./EditSingleAnswerItem";

export function CreateForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [answers, setAnswers ]= useState(["1 вариант", "2 вариант"]);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const poll = {
            title,
            description,
            answers,
        };
        console.log(JSON.stringify(poll, null, 2));
    };

    const createAnswer = () => {
        setAnswers(prevAnswers => {
            return [...prevAnswers, ""];
        });
    };

    const updateAnswer = (id: number, newValue: string): void => {
        setAnswers(prevAnswers => {
            let newAnswers = [...prevAnswers];
            newAnswers[id] = newValue;
            return newAnswers;
        });
    };

    const deleteAnswer = (id: number) => {
        setAnswers(prevAnswers => {
            const nextAnswers = [...prevAnswers];
            nextAnswers.splice(id, 1);
            return nextAnswers;
        });
    };


    return (
        <div className="roundedFrame">
            <h2>Создание голосования</h2>
            <form onSubmit={handleSubmit}>
                <InputFieldWithLabel
                    label={"Заголовок"}
                    inputType={"text"}
                    placeholder={"..."}
                    value={title}
                    onChange={setTitle}/>
                <InputFieldWithLabel
                    label={"Описание"}
                    inputType={"text"}
                    placeholder={"..."}
                    value={description}
                    onChange={setDescription}/>

                <div className={"line"}/>
                <h3>Варианты ответа</h3>
                {answers.map((answer, index) => (
                    <EditSingleAnswerItem
                        key={index}
                        id={index}
                        answer={answer}
                        onDelete={deleteAnswer}
                        onChange={updateAnswer}/>
                ))}
                <button type={"button"} className={"success"} onClick={createAnswer}>Добавить ответ</button>
                <div className={"line"}/>

                <button className={"success"}>Создать</button>
            </form>
        </div>
    )
}