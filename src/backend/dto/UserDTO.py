from pydantic import BaseModel


class UserDTO(BaseModel):
    id: int
    username: str


class UserAddDTO(BaseModel):
    username: str
    password: str
