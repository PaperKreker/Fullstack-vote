import {SingleAnswerForm} from "../components/SingleAnswerForm";
import {AppHeader} from "../components/AppHeader";
import {useState} from "react";

export function MainPage({onOpenProfile} : {onOpenProfile: () => void}) {
    const [isVoted, setIsVoted] = useState(true);

    return (
        <div className="App">
            <AppHeader onOpenProfile={onOpenProfile}/>
            <SingleAnswerForm
                title={"Сколько?"}
                description={"Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание "}
                answers={["Первый вариант", "Второй вариант", "Третий вариант"]}
                isVoted={isVoted}/>
        </div>
    )
}
