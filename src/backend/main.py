from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from Authorization import check_password, create_token, get_current_user_id
from db.Proxy import DBProxy
from dto.UserDTO import UserDTO

app = FastAPI()
db_proxy = DBProxy()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = db_proxy.users.get_user_by_username(form_data.username)

    if not user or not check_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    return {"access_token": create_token(user["id"]), "token_type": "bearer"}

@app.get("/me/")
async def get_me(user_id: int = Depends(get_current_user_id)):
    user_data = db_proxy.users.get_user(user_id)

    if not user_data:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    return UserDTO(**user_data)

class UserAdd(BaseModel):
    username: str
    password: str
@app.post("/user/add/")
async def add_user(user_add: UserAdd):
    return db_proxy.users.add_user(user_add.username, user_add.password)

@app.delete("/me/")
async def delete_me(user_id: int = Depends(get_current_user_id)):
    return db_proxy.users.delete_user(user_id)

@app.get("/poll/")
async def get_poll(id: int, user_id: int = Depends(get_current_user_id)):
    return db_proxy.polls.get_poll_for_user(id, user_id)

class PollAdd(BaseModel):
    title: str
    description: str | None = None
    answers: list[str]
@app.post("/poll/add/")
async def add_poll(poll_add: PollAdd, user_id: int = Depends(get_current_user_id)):
    return db_proxy.polls.create_poll(user_id, poll_add.title, poll_add.description, poll_add.answers)

class PollDelete(BaseModel):
    id: int
@app.delete("/poll/")
async def delete_poll(poll_delete: PollDelete, user_id: int = Depends(get_current_user_id)):
    return db_proxy.polls.delete_poll(poll_delete.id, user_id)

class PollVote(BaseModel):
    poll_id: int
    option_id: int
@app.post("/poll/vote/")
async def vote_in_poll(poll_vote: PollVote, user_id: int = Depends(get_current_user_id)):
    return db_proxy.polls.vote_in_poll(user_id, poll_vote.poll_id, poll_vote.option_id)

@app.get("/my/poll/")
async def get_my_poll(id: int, user_id: int = Depends(get_current_user_id)):
    return db_proxy.polls.get_poll_for_author(id, user_id)

@app.get("/my/polls/")
async def get_my_polls(user_id: int = Depends(get_current_user_id)):
    return db_proxy.polls.get_polls_for_author(user_id)

@app.get("/my/polls/ids/")
async def get_my_poll_ids(user_id: int = Depends(get_current_user_id)):
    return db_proxy.polls.get_poll_ids_for_author(user_id)

