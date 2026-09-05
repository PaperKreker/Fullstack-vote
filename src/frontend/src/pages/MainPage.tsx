import {SingleAnswerForm} from "../components/SingleAnswerForm";
import {AppHeader} from "../components/AppHeader";

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