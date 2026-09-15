from typing import List

from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload

from db.Errors import NotFoundError, ValidationError, AccessDeniedError
from db.Models import Poll, VoteOption, UserPollParticipation


class ProxyPoll:
    def __init__(self, parent):
        self.parent = parent


    def create_poll(self, author_id: int, title: str, description: str | None, option_texts: List[str]) -> int:
        if not option_texts or len(option_texts) < 2:
            raise ValidationError("В голосовании должно быть как минимум 2 варианта ответа.")

        session = self.parent.session_local()
        try:
            new_poll = Poll(
                author_id=author_id,
                title=title,
                description=description
            )

            for text_item in option_texts:
                option = VoteOption(option_text=text_item)
                new_poll.options.append(option)

            session.add(new_poll)
            session.commit()
            session.refresh(new_poll)

            return new_poll.id

        except ValueError as e:
            session.rollback()
            raise ValidationError(str(e))
        finally:
            session.close()


    def get_poll_for_author(self, poll_id: int, user_id: int) -> dict:
        session = self.parent.session_local()
        try:
            stmt = (
                select(Poll)
                .where(Poll.id == poll_id)
                .options(selectinload(Poll.options))
            )
            poll = session.execute(stmt).scalar_one_or_none()

            if not poll:
                raise NotFoundError(f"Голосование с ID {poll_id} не найдено.")

            if poll.author_id != user_id:
                raise AccessDeniedError(f"Пользователь {user_id} не является автором голосования {poll_id}.")

            total_votes = sum(opt.votes_count for opt in poll.options)

            return {
                "id": poll.id,
                "title": poll.title,
                "description": poll.description,
                "total_votes": total_votes,
                "results": [
                    {
                        "id": opt.id,
                        "option_text": opt.option_text,
                        "votes": opt.votes_count,
                    }
                    for opt in poll.options
                ]
            }

        finally:
            session.close()


    def get_poll_ids_for_author(self, author_id: int) -> List[int]:
        session = self.parent.session_local()
        try:
            stmt = select(Poll.id).where(Poll.author_id == author_id)
            poll_ids = session.execute(stmt).scalars().all()

            return list(poll_ids)

        finally:
            session.close()


    def get_polls_for_author(self, author_id: int) -> List[dict]:
        session = self.parent.session_local()
        try:
            stmt = (
                select(Poll)
                .where(Poll.author_id == author_id)
                .options(selectinload(Poll.options))
            )
            polls = session.execute(stmt).scalars().all()

            return [
                {
                    "id": poll.id,
                    "title": poll.title,
                    "description": poll.description,
                    "total_votes": sum(opt.votes_count for opt in poll.options),
                    "results": [
                        {
                            "id": opt.id,
                            "option_text": opt.option_text,
                            "votes": opt.votes_count,
                        }
                        for opt in poll.options
                    ]
                }
                for poll in polls
            ]

        finally:
            session.close()


    def get_poll_for_user(self, poll_id: int, user_id: int) -> dict:
        session = self.parent.session_local()
        try:
            participation_stmt = select(UserPollParticipation).where(
                and_(
                    UserPollParticipation.user_id == user_id,
                    UserPollParticipation.poll_id == poll_id
                )
            )
            already_voted = session.execute(participation_stmt).scalar_one_or_none()

            poll_stmt = (
                select(Poll)
                .where(Poll.id == poll_id)
                .options(selectinload(Poll.options))
            )
            poll = session.execute(poll_stmt).scalar_one_or_none()

            if not poll:
                raise NotFoundError(f"Голосование с ID {poll_id} не найдено.")

            poll_data = {
                "id": poll.id,
                "title": poll.title,
                "description": poll.description,
                "author_id": poll.author_id,
                "is_voted": already_voted is not None,
                "options": [
                    {
                        "id": opt.id,
                        "option_text": opt.option_text
                    }
                    for opt in poll.options
                ]
            }
            return poll_data

        finally:
            session.close()


    def delete_poll(self, poll_id: int, author_id: int) -> bool:
        session = self.parent.session_local()
        try:
            stmt = select(Poll).where(Poll.id == poll_id)
            poll = session.execute(stmt).scalar_one_or_none()

            if not poll:
                raise NotFoundError(f"Голосование с ID {poll_id} не найдено.")

            if poll.author_id != author_id:
                raise AccessDeniedError(f"Пользователь {author_id} не является автором голосования {poll_id}.")

            session.delete(poll)
            session.commit()
            return True

        finally:
            session.close()


    def vote_in_poll(self, user_id: int, poll_id: int, option_id: int) -> bool:
        session = self.parent.session_local()
        try:
            participation_stmt = select(UserPollParticipation).where(
                and_(
                    UserPollParticipation.user_id == user_id,
                    UserPollParticipation.poll_id == poll_id
                )
            )
            already_voted = session.execute(participation_stmt).scalar_one_or_none()

            if already_voted:
                raise AccessDeniedError("Вы уже проголосовали.")

            option_stmt = select(VoteOption).where(
                and_(
                    VoteOption.id == option_id,
                    VoteOption.poll_id == poll_id
                )
            )
            option = session.execute(option_stmt).scalar_one_or_none()

            if not option:
                raise NotFoundError(f"Вариант ответа {option_id} не найден в голосовании {poll_id}.")

            participation = UserPollParticipation(user_id=user_id, poll_id=poll_id)
            session.add(participation)

            option.votes_count += 1

            session.commit()
            return True

        finally:
            session.close()
