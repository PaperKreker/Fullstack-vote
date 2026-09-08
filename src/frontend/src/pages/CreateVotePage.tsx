import {SingleAnswerForm} from "../components/SingleAnswerForm";
import {AppHeader} from "../components/AppHeader";
import {CreateForm} from "../components/CreateForm";

export function CreateVotePage() {
    return (
        <div className="App">
            <AppHeader/>
            <CreateForm/>
        </div>
    )
}