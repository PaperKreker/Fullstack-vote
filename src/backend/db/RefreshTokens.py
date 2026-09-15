import hashlib
from datetime import datetime, timezone

from sqlalchemy import select, delete

from db.Errors import AuthError
from db.Models import RefreshToken


def hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


class ProxyRefreshToken:
    def __init__(self, parent):
        self.parent = parent

    def add_token(self, user_id: int, token: str, expires_at: datetime) -> None:
        session = self.parent.session_local()
        try:
            new_token = RefreshToken(
                user_id=user_id,
                token_hash=hash_refresh_token(token),
                expires_at=expires_at
            )

            session.add(new_token)
            session.commit()

        finally:
            session.close()

    def get_user_id(self, token: str) -> int:
        session = self.parent.session_local()
        try:
            stmt = select(RefreshToken).where(RefreshToken.token_hash == hash_refresh_token(token))
            found_token = session.execute(stmt).scalar_one_or_none()

            if not found_token:
                raise AuthError("Нужно зайти в аккаунт")

            if found_token.expires_at < datetime.now(timezone.utc):
                session.delete(found_token)
                session.commit()
                raise AuthError("Нужно зайти в аккаунт")

            return found_token.user_id

        finally:
            session.close()

    def delete_token(self, token: str) -> None:
        session = self.parent.session_local()
        try:
            stmt = delete(RefreshToken).where(RefreshToken.token_hash == hash_refresh_token(token))
            session.execute(stmt)
            session.commit()

        finally:
            session.close()
