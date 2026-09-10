from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload

from db import Models
from db.Models import User


class ProxyUser:
    def __init__(self, parent):
        self.parent = parent

    def add_user(self, username: str, password_raw: str) -> int | None:
        session = self.parent.session_local()
        try:
            new_user = Models.User(username=username, password=password_raw)

            session.add(new_user)
            session.commit()
            session.refresh(new_user)

            print(f"Пользователь '{username}' успешно создан с ID {new_user.id}!")
            return new_user.id

        except ValueError as e:
            session.rollback()
            print(f"Ошибка валидации при создании пользователя: {e}")
            return None

        except IntegrityError:
            session.rollback()
            print(f"Ошибка: Пользователь с именем '{username}' уже существует.")
            return None
        finally:
            session.close()


    def get_user(self, user_id: int, include_polls: bool = False) -> dict | None:
        session = self.parent.session_local()
        try:
            stmt = select(User).where(User.id == user_id)
            if include_polls:
                stmt = stmt.options(selectinload(User.created_polls))

            user = session.execute(stmt).scalar_one_or_none()

            if not user:
                print(f"Пользователь с ID {user_id} не найден.")
                return None

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
                print(f"Ошибка: Пользователь с ID {user_id} не найден.")
                return False

            session.delete(user)
            session.commit()
            print(f"Пользователь с ID {user_id} успешно удален.")
            return True

        except Exception as e:
            session.rollback()
            print(f"Ошибка при удалении пользователя: {e}")
            return False

        finally:
            session.close()
