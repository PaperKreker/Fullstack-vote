from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from db.Errors import (
    DBError,
    NotFoundError,
    AlreadyExistsError,
    ValidationError,
    AccessDeniedError,
    AuthError,
)

ERROR_STATUSES = {
    ValidationError: 400,
    AuthError: 401,
    AccessDeniedError: 403,
    NotFoundError: 404,
    AlreadyExistsError: 409,
}


def add_error_handlers(app: FastAPI):
    @app.exception_handler(DBError)
    async def db_error_handler(request: Request, error: DBError):
        status_code = ERROR_STATUSES.get(type(error), 500)
        return JSONResponse(status_code=status_code, content={"detail": str(error)})
