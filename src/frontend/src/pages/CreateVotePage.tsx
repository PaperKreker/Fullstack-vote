import {SingleAnswerForm} from "../components/SingleAnswerForm";
import {AppHeader} from "../components/AppHeader";
import {CreateForm} from "../components/CreateForm";

export function CreateVotePage({onOpenProfile} : {onOpenProfile: () => void}) {
    return (
        <div className="App">
            <AppHeader onOpenProfile={onOpenProfile}/>
            <CreateForm/>
        </div>
    )
}
