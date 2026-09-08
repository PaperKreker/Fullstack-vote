import {SingleAnswerForm} from "../components/SingleAnswerForm";
import {AppHeader} from "../components/AppHeader";
import {AuthModal} from "../components/AuthModal";
import {RegisterModal} from "../components/RegisterModal";

export function MainPage() {
    return (
        <div className="App">
            <AppHeader/>
            <SingleAnswerForm
                title={"Сколько?"}
                description={"Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание "}
                answers={["Первый вариант", "Второй вариант", "Третий вариант"]}/>
        </div>
    )
}