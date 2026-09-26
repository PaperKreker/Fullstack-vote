from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ErrorHandlers import add_error_handlers
from routers import Auth, Polls, Users

app = FastAPI()

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

add_error_handlers(app)

app.include_router(Auth.router)
app.include_router(Users.router)
app.include_router(Polls.router)


@app.get("/")
async def root():
    return {"message": "Welcome to the Votes API!"}
