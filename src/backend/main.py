from fastapi import FastAPI
from pydantic import BaseModel

from db.Proxy import DBProxy

app = FastAPI()
db_proxy = DBProxy()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/user/")
async def get_user(id: int):
    return db_proxy.users.get_user(id)

class UserAdd(BaseModel):
    username: str
    password: str
@app.post("/user/add/")
async def add_user(user_add: UserAdd):
    return db_proxy.users.add_user(user_add.username, user_add.password)

class UserDelete(BaseModel):
    id: int
@app.delete("/user/")
async def delete_user(user_delete: UserDelete):
    return db_proxy.users.delete_user(user_delete.id)

@app.get("/poll/")
async def get_user(id: int):
    return db_proxy.users.get_user(id)

