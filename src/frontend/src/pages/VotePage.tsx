import {SingleAnswerForm} from "../components/SingleAnswerForm";
import {useState} from "react";
import {useParams} from "react-router-dom";

export function VotePage() {
    const {id} = useParams();
    const [isVoted, setIsVoted] = useState(false);

    return (
        <SingleAnswerForm
            title={"Сколько?"}
            description={"Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание "}
            answers={["Первый вариант", "Второй вариант", "Третий вариант"]}
            isVoted={isVoted}/>
    )
}
