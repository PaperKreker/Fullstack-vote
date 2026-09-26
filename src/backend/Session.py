from fastapi import Response

from Authorization import (
    COOKIE_SECURE,
    REFRESH_EXPIRE_DAYS,
    create_access_token,
    create_refresh_token,
    refresh_expires_at,
)
from Database import db_proxy
from dto.TokenDTO import TokenDTO

REFRESH_COOKIE = "refresh_token"


def set_refresh_cookie(response: Response, token: str):
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=REFRESH_EXPIRE_DAYS * 24 * 60 * 60,
        path="/")


def clear_refresh_cookie(response: Response):
    response.delete_cookie(REFRESH_COOKIE, path="/")


def start_session(response: Response, user_id: int) -> TokenDTO:
    refresh_token = create_refresh_token()
    db_proxy.refresh_tokens.add_token(user_id, refresh_token, refresh_expires_at())
    set_refresh_cookie(response, refresh_token)

    return TokenDTO(access_token=create_access_token(user_id))
