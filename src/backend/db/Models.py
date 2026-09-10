from typing import List

import bcrypt
from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, validates


class Base(DeclarativeBase):
    pass


class Poll(Base):
    __tablename__ = "polls"

    id: Mapped[int] = mapped_column(primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    author: Mapped["User"] = relationship(back_populates="created_polls")
    options: Mapped[List["VoteOption"]] = relationship(back_populates="poll", cascade="all, delete-orphan")

    @validates("title")
    def validate_option_text(self, key, title):
        if not title or len(title) == 0:
            raise ValueError("Заголовок не должен быть пустым")
        return title

    @validates("options")
    def validate_option_text(self, key, options):
        if not options or len(options) <= 1:
            raise ValueError("Должно быть больше 1 варианта ответа")
        return options


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)

    created_polls: Mapped[List["Poll"]] = relationship(back_populates="author")

    @validates("username")
    def validate_username(self, key, username):
        if not username or len(username) < 3:
            raise ValueError("Имя пользователя должно содержать минимум 3 символа.")
        if " " in username:
            raise ValueError("Имя пользователя не должно содержать пробелов.")
        return username

    @validates("password")
    def validate_and_hash_password(self, key, password):
        if not password or len(password) < 8:
            raise ValueError("Пароль должен содержать минимум 8 символов.")

        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')


class VoteOption(Base):
    __tablename__ = "vote_options"

    id: Mapped[int] = mapped_column(primary_key=True)
    poll_id: Mapped[int] = mapped_column(ForeignKey("polls.id", ondelete="CASCADE"), nullable=False)
    option_text: Mapped[str] = mapped_column(String(255), nullable=False)
    votes_count: Mapped[int] = mapped_column(default=0, nullable=False)

    poll: Mapped["Poll"] = relationship(back_populates="options")

    @validates("option_text")
    def validate_option_text(self, key, option_text):
        if not option_text or len(option_text) == 0:
            raise ValueError("Вариант голосования не должен быть пустым")
        return option_text


class UserPollParticipation(Base):
    __tablename__ = "user_polls"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    poll_id: Mapped[int] = mapped_column(ForeignKey("polls.id", ondelete="CASCADE"), nullable=False)


def create_models(engine):
    print("Создание моделей.")
    Base.metadata.create_all(engine)