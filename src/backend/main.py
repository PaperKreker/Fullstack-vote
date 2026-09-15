from fastapi import FastAPI, Depends, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from Authorization import (
    COOKIE_SECURE,
    REFRESH_EXPIRE_DAYS,
    check_password,
    create_access_token,
    create_refresh_token,
    get_current_user_id,
    refresh_expires_at,
)
from db.Errors import DBError, NotFoundError, AlreadyExistsError, ValidationError, AccessDeniedError, AuthError
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

REFRESH_COOKIE = "refresh_token"

ERROR_STATUSES = {
    AuthError: 401,
    ValidationError: 400,
    AccessDeniedError: 403,
    NotFoundError: 404,
    AlreadyExistsError: 409,
}

@app.exception_handler(DBError)
async def db_error_handler(request: Request, error: DBError):
    status_code = ERROR_STATUSES.get(type(error), 500)
    return JSONResponse(status_code=status_code, content={"detail": str(error)})

def set_refresh_cookie(response: Response, token: str):
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=REFRESH_EXPIRE_DAYS * 24 * 60 * 60,
        path="/")

def start_session(response: Response, user_id: int) -> dict:
    refresh_token = create_refresh_token()
    db_proxy.refresh_tokens.add_token(user_id, refresh_token, refresh_expires_at())
    set_refresh_cookie(response, refresh_token)

    return {"access_token": create_access_token(user_id), "token_type": "bearer"}

@app.get("/")
async def root():
    return {"message": "Welcome to the Votes API!"}

@app.post("/token")
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    user = db_proxy.users.get_user_by_username(form_data.username)

    if not user or not check_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    return start_session(response, user["id"])

@app.post("/refresh")
async def refresh_session(request: Request, response: Response):
    refresh_token = request.cookies.get(REFRESH_COOKIE)

    if not refresh_token:
        raise HTTPException(status_code=401, detail="Нужно зайти в аккаунт")

    try:
        user_id = db_proxy.refresh_tokens.get_user_id(refresh_token)
    except AuthError as error:
        expired = JSONResponse(status_code=401, content={"detail": str(error)})
        expired.delete_cookie(REFRESH_COOKIE, path="/")
        return expired

    db_proxy.refresh_tokens.delete_token(refresh_token)

    return start_session(response, user_id)

@app.post("/logout")
async def logout(request: Request):
    refresh_token = request.cookies.get(REFRESH_COOKIE)

    if refresh_token:
        db_proxy.refresh_tokens.delete_token(refresh_token)

    result = JSONResponse(content={"success": True})
    result.delete_cookie(REFRESH_COOKIE, path="/")
    return result

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
async def get_poll(poll_id: int, user_id: int = Depends(get_current_user_id)):
    return db_proxy.polls.get_poll_for_user(poll_id, user_id)

class PollAdd(BaseModel):
    title: str
    description: str | None = None
    answers: list[str]
@app.post("/poll/add/")
async def add_poll(poll_add: PollAdd, user_id: int = Depends(get_current_user_id)):
    return db_proxy.polls.create_poll(user_id, poll_add.title, poll_add.description, poll_add.answers)

class PollDelete(BaseModel):
    poll_id: int
@app.delete("/poll/")
async def delete_poll(poll_delete: PollDelete, user_id: int = Depends(get_current_user_id)):
    return db_proxy.polls.delete_poll(poll_delete.poll_id, user_id)

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

