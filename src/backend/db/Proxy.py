import os
from dotenv import load_dotenv

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import ProgrammingError

from db import Models
from db.Polls import ProxyPoll
from db.Users import ProxyUser


class DBEnv:
    def __init__(self):
        load_dotenv()
        self.USER = os.getenv("DB_USER")
        self.PASSWORD = os.getenv("DB_PASSWORD")
        self.HOST = os.getenv("DB_HOST")
        self.PORT = os.getenv("DB_PORT")
        self.NAME = os.getenv("DB_NAME")


class DBProxy():
    def check_if_db_exists(self):
        db_env = self.db_env
        SYS_DATABASE_URL = f"postgresql+psycopg2://{db_env.USER}:{db_env.PASSWORD}@{db_env.HOST}:{db_env.PORT}/postgres"
        sys_engine = create_engine(SYS_DATABASE_URL)

        try:
            with sys_engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
                conn.execute(text(f"CREATE DATABASE {db_env.NAME}"))
                print(f"База данных '{db_env.NAME}' успешно создана!")
        except ProgrammingError as e:
            if "already exists" in str(e):
                print(f"База данных '{db_env.NAME}' уже существует, пропускаем создание.")
            else:
                raise e


    def connect_to_db(self):
        db_env = self.db_env
        TARGET_DATABASE_URL = f"postgresql+psycopg2://{db_env.USER}:{db_env.PASSWORD}@{db_env.HOST}:{db_env.PORT}/{db_env.NAME}"
        engine = create_engine(TARGET_DATABASE_URL)

        try:
            with engine.connect() as connection:
                print(f"Успешное подключение к {db_env.NAME}!")
                return engine
        except Exception as e:
            print(f"Ошибка подключения: {e}")
        return None


    def __init__(self):
        self.users = ProxyUser(self)
        self.polls = ProxyPoll(self)

        self.db_env = DBEnv()
        self.check_if_db_exists()
        self.engine = self.connect_to_db()
        self.session_local = sessionmaker(self.engine)
        Models.create_models(self.engine)
