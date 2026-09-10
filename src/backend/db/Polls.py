from typing import List

from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload

from db.Models import Poll, VoteOption, UserPollParticipation


class ProxyPoll:
    def __init__(self, parent):
        self.parent = parent


    def create_poll(self, author_id: int, title: str, description: str | None, option_texts: List[str]) -> Poll | None:
        if not option_texts or len(option_texts) < 2:
            print("Ошибка: В голосовании должно быть как минимум 2 варианта ответа.")
            return None

        session = self.parent.SessionLocal()
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

            print(f"Голосование '{title}' успешно создано с ID {new_poll.id}!")
            return new_poll

        except Exception as e:
            session.rollback()
            print(f"Ошибка при создании голосования: {e}")
            return None
        finally:
            session.close()


    def get_poll_for_author(self, poll_id: int, user_id: int) -> dict | None:
        session = self.parent.session_local()
        try:
            stmt = (
                select(Poll)
                .where(Poll.id == poll_id)
                .options(selectinload(Poll.options))
            )
            poll = session.execute(stmt).scalar_one_or_none()

            if not poll:
                print(f"Голосование с ID {poll_id} не найдено.")
                return None

            if poll.author_id != user_id:
                print(f"Доступ запрещен: Пользователь {user_id} не является автором голосования {poll_id}.")
                return None

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

        except Exception as e:
            print(f"Ошибка при получении результатов: {e}")
            return None
        finally:
            session.close()


    def get_poll_for_user(self, poll_id: int, user_id: int) -> dict | None:
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
                print(f"Доступ запрещен: Пользователь {user_id} уже принял участие в голосовании {poll_id}.")
                return None

            poll_stmt = (
                select(Poll)
                .where(Poll.id == poll_id)
                .options(selectinload(Poll.options))
            )
            poll = session.execute(poll_stmt).scalar_one_or_none()

            if not poll:
                print(f"Голосование с ID {poll_id} не найдено.")
                return None

            poll_data = {
                "id": poll.id,
                "title": poll.title,
                "description": poll.description,
                "author_id": poll.author_id,
                "options": [
                    {
                        "id": opt.id,
                        "option_text": opt.option_text
                    }
                    for opt in poll.options
                ]
            }
            return poll_data

        except Exception as e:
            print(f"Ошибка при получении голосования: {e}")
            return None
        finally:
            session.close()


    def delete_poll(self, poll_id: int, author_id: int) -> bool:
        session = self.parent.SessionLocal()
        try:
            stmt = select(Poll).where(and_(Poll.id == poll_id, Poll.author_id == author_id))
            poll = session.execute(stmt).scalar_one_or_none()

            if not poll:
                print(f"Ошибка: Голосование с ID {poll_id} не найдено или вы не являетесь его автором.")
                return False

            session.delete(poll)
            session.commit()
            print(f"Голосование с ID {poll_id} успешно удалено.")
            return True

        except Exception as e:
            session.rollback()
            print(f"Ошибка при удалении голосования: {e}")
            return False
        finally:
            session.close()


    def vote_in_poll(self, user_id: int, poll_id: int, option_id: int) -> bool:
        session = self.parent.SessionLocal()
        try:
            participation_stmt = select(UserPollParticipation).where(
                and_(
                    UserPollParticipation.user_id == user_id,
                    UserPollParticipation.poll_id == poll_id
                )
            )
            already_voted = session.execute(participation_stmt).scalar_one_or_none()

            if already_voted:
                print(f"Ошибка: Пользователь {user_id} уже принимал участие в голосовании {poll_id}!")
                return False

            option_stmt = select(VoteOption).where(
                and_(
                    VoteOption.id == option_id,
                    VoteOption.poll_id == poll_id
                )
            )
            option = session.execute(option_stmt).scalar_one_or_none()

            if not option:
                print(f"Ошибка: Вариант ответа {option_id} не найден в голосовании {poll_id}.")
                return False

            participation = UserPollParticipation(user_id=user_id, poll_id=poll_id)
            session.add(participation)

            option.votes_count += 1

            session.commit()
            print(f"Голос пользователя {user_id} успешно учтен!")
            return True

        except Exception as e:
            session.rollback()
            print(f"Ошибка при попытке проголосовать: {e}")
            return False
        finally:
            session.close()
