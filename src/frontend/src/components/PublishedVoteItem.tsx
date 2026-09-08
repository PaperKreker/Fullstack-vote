import {CloseButton} from "./CloseButton";

export function PublishedVoteItem(
    {id, title, description, onDelete} :
    {id: number, title: string, description: string, onDelete: (id: number) => void}) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            padding: '0 15px 15px 15px'}} className="roundedFrame">
            <div>
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
            <CloseButton onClick={() => onDelete(id)}/>
        </div>
    )
}
