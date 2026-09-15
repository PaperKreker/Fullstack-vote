class DBError(Exception):
    pass


class NotFoundError(DBError):
    pass


class AlreadyExistsError(DBError):
    pass


class ValidationError(DBError):
    pass


class AccessDeniedError(DBError):
    pass
