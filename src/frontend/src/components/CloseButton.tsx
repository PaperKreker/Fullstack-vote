import crossImage from "../images/cross.svg";

export function CloseButton({onClick}: {onClick?: () => void}) {
    return (
        <button style={{width: '32px', height: '32px', padding: '0'}} className={"error"} onClick={onClick}>
            <img style={{width: '100%', height: '100%'}} src={crossImage} alt={"cross"}/>
        </button>
    )
}