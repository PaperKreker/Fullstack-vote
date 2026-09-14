import React from "react";
import { useState } from "react";
import {InputFieldWithLabel} from "../shared/InputFieldWithLabel";
import {EditSingleAnswerItem} from "../entities/EditSingleAnswerItem";
import {
    checkAnswers,
    checkEachAnswer,
    checkTitle
} from "../shared/Validation";

export function CreateForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [answers, setAnswers ]= useState(["1 вариант", "2 вариант"]);
    const [errors, setErrors] = useState({title: "", answers: "", eachAnswer: [""]});

    const clearAnswerErrors = () => {
        const newErrors = {
            title: errors.title,
            answers: "",
            eachAnswer: [""],
        };
        setErrors(newErrors);
    }

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { result: eachAnswer, hasError: hasErrorInAnswers } = checkEachAnswer(answers);
        const newErrors = {
            title: checkTitle(title),
            answers: checkAnswers(answers),
            eachAnswer: eachAnswer,
        };
        setErrors(newErrors);

        if (newErrors.title || newErrors.answers || hasErrorInAnswers) {
            return;
        }

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
                    onChange={setTitle}
                    error={errors.title}/>
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
                        onChange={updateAnswer}
                        error={errors.eachAnswer[index]}/>
                ))}
                {errors.answers && <p className={"errorText"}>{errors.answers}</p>}
                <button
                    type={"button"}
                    className={"success"}
                    onClick={() => {
                        createAnswer();
                        clearAnswerErrors();
                    }}>
                    Добавить ответ</button>
                <div className={"line"}/>

                <button className={"success"}>Создать</button>
            </form>
        </div>
    )
}