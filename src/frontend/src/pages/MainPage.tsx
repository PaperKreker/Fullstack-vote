import {SingleAnswerForm} from "../components/SingleAnswerForm";
import {AppHeader} from "../components/AppHeader";
import {AuthModal} from "../components/AuthModal";
import {RegisterModal} from "../components/RegisterModal";

export function MainPage({onOpenProfile} : {onOpenProfile: () => void}) {
    return (
        <div className="App">
            <AppHeader onOpenProfile={onOpenProfile}/>
            <SingleAnswerForm
                title={"Сколько?"}
                description={"Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание Тестовое описание "}
                answers={["Первый вариант", "Второй вариант", "Третий вариант"]}/>
        </div>
    )
}
