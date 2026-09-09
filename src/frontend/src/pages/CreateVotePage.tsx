import {CreateForm} from "../components/CreateForm";

export function CreateVotePage(
    {authenticatedUser} :
    {authenticatedUser: {name: string} | null}) {
    if (!authenticatedUser) {
        return (
            <div style={{padding: '0 15px 15px 15px'}} className="roundedFrame">
                <h2>Создание голосования</h2>
                <p>Чтобы создать голосование, нужно зайти в аккаунт.</p>
                <p>Нажмите кнопку «Войти» сверху справа.</p>
            </div>
        )
    }

    return (
        <CreateForm/>
    )
}
