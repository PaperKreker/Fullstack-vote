from pydantic import BaseModel


class PollAddDTO(BaseModel):
    title: str
    description: str | None = None
    answers: list[str]


class PollDeleteDTO(BaseModel):
    poll_id: int


class PollVoteDTO(BaseModel):
    code: str
    option_id: int
