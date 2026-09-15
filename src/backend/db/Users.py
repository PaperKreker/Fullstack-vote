from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload

from db import Models
from db.Errors import NotFoundError, AlreadyExistsError, ValidationError
from db.Models import User


class ProxyUser:
    def __init__(self, parent):
        self.parent = parent

    def add_user(self, username: str, password_raw: str) -> int:
        session = self.parent.session_local()
        try:
            new_user = Models.User(username=username, password=password_raw)

            session.add(new_user)
            session.commit()
            session.refresh(new_user)

            return new_user.id

        except ValueError as e:
            session.rollback()
            raise ValidationError(str(e))

        except IntegrityError:
            session.rollback()
            raise AlreadyExistsError(f"Пользователь с именем '{username}' уже существует.")
        finally:
            session.close()


    def get_user(self, user_id: int, include_polls: bool = False) -> dict:
        session = self.parent.session_local()
        try:
            stmt = select(User).where(User.id == user_id)
            if include_polls:
                stmt = stmt.options(selectinload(User.created_polls))

            user = session.execute(stmt).scalar_one_or_none()

            if not user:
                raise NotFoundError(f"Пользователь с ID {user_id} не найден.")

            user_data = {
                "id": user.id,
                "username": user.username,
            }

            if include_polls:
                user_data["created_polls"] = [
                    {
                        "id": poll.id,
                        "title": poll.title,
                        "description": poll.description
                    }
                    for poll in user.created_polls
                ]

            return user_data

        finally:
            session.close()

    def get_user_by_username(self, username: str) -> dict | None:
        session = self.parent.session_local()
        try:
            stmt = select(User).where(User.username == username)
            user = session.execute(stmt).scalar_one_or_none()

            if not user:
                print(f"Пользователь с логином '{username}' не найден.")
                return None

            return {
                "id": user.id,
                "username": user.username,
                "password": user.password,
            }

        except Exception as e:
            print(f"Ошибка при получении данных пользователя: {e}")
            return None
        finally:
            session.close()

    def delete_user(self, user_id: int) -> bool:
        session = self.parent.session_local()
        try:
            stmt = select(User).where(User.id == user_id)
            user = session.execute(stmt).scalar_one_or_none()

            if not user:
                raise NotFoundError(f"Пользователь с ID {user_id} не найден.")

            session.delete(user)
            session.commit()
            return True

        finally:
            session.close()
