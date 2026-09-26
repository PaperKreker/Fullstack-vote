from fastapi import APIRouter, Depends

from Authorization import get_current_user_id
from Database import db_proxy
from PollCode import decode_poll_code, encode_poll_id
from dto.PollDTO import PollAddDTO, PollDeleteDTO, PollVoteDTO

router = APIRouter()


def with_code(poll: dict) -> dict:
    poll_with_code = dict(poll)
    poll_with_code["code"] = encode_poll_id(poll["id"])
    return poll_with_code


@router.get("/poll/")
async def get_poll(code: str, user_id: int = Depends(get_current_user_id)):
    poll_id = decode_poll_code(code)
    poll = db_proxy.polls.get_poll_for_user(poll_id, user_id)

    poll.pop("id")
    poll["code"] = code
    return poll


@router.post("/poll/add/")
async def add_poll(poll_add: PollAddDTO, user_id: int = Depends(get_current_user_id)):
    poll_id = db_proxy.polls.create_poll(user_id, poll_add.title, poll_add.description, poll_add.answers)
    return {"id": poll_id, "code": encode_poll_id(poll_id)}


@router.delete("/poll/")
async def delete_poll(poll_delete: PollDeleteDTO, user_id: int = Depends(get_current_user_id)):
    return db_proxy.polls.delete_poll(poll_delete.poll_id, user_id)


@router.post("/poll/vote/")
async def vote_in_poll(poll_vote: PollVoteDTO, user_id: int = Depends(get_current_user_id)):
    poll_id = decode_poll_code(poll_vote.code)
    return db_proxy.polls.vote_in_poll(user_id, poll_id, poll_vote.option_id)


@router.get("/my/poll/")
async def get_my_poll(poll_id: int, user_id: int = Depends(get_current_user_id)):
    return with_code(db_proxy.polls.get_poll_for_author(poll_id, user_id))


@router.get("/my/polls/")
async def get_my_polls(user_id: int = Depends(get_current_user_id)):
    polls = db_proxy.polls.get_polls_for_author(user_id)
    return [with_code(poll) for poll in polls]


@router.get("/my/polls/ids/")
async def get_my_poll_ids(user_id: int = Depends(get_current_user_id)):
    return db_proxy.polls.get_poll_ids_for_author(user_id)
