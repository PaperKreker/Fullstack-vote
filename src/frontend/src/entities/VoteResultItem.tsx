export function VoteResultItem({text, votes, allVotes}: {text: string, votes: number, allVotes: number}) {
    let percent = 0;
    if (allVotes > 0) {
        percent = Math.round(votes / allVotes * 100);
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '5px', width: '100%'}}>
            <label>{text} — {percent}% ({votes})</label>
            <div className={"resultBar"}>
                <div className={"resultBarFill"} style={{width: percent + '%'}}/>
            </div>
        </div>
    )
}
