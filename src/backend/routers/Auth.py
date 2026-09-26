from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm

from Authorization import check_password
from Database import db_proxy
from Session import REFRESH_COOKIE, clear_refresh_cookie, start_session
from db.Errors import AuthError

router = APIRouter()


@router.post("/token")
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    user = db_proxy.users.get_user_by_username(form_data.username)

    if not user or not check_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    return start_session(response, user["id"])


@router.post("/refresh")
async def refresh_session(request: Request, response: Response):
    refresh_token = request.cookies.get(REFRESH_COOKIE)

    if not refresh_token:
        raise HTTPException(status_code=401, detail="Нужно зайти в аккаунт")

    try:
        user_id = db_proxy.refresh_tokens.get_user_id(refresh_token)
    except AuthError as error:
        expired = JSONResponse(status_code=401, content={"detail": str(error)})
        clear_refresh_cookie(expired)
        return expired

    db_proxy.refresh_tokens.delete_token(refresh_token)

    return start_session(response, user_id)


@router.post("/logout")
async def logout(request: Request):
    refresh_token = request.cookies.get(REFRESH_COOKIE)

    if refresh_token:
        db_proxy.refresh_tokens.delete_token(refresh_token)

    result = JSONResponse(content={"success": True})
    clear_refresh_cookie(result)
    return result
