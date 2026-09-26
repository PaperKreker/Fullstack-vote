import base64
import hashlib
import hmac

from Authorization import SECRET_KEY
from db.Errors import NotFoundError

SIGNATURE_LENGTH = 16


def sign(poll_part: str) -> str:
    digest = hmac.new(SECRET_KEY.encode("utf-8"), poll_part.encode("utf-8"), hashlib.sha256)
    return digest.hexdigest()[:SIGNATURE_LENGTH]


def encode_poll_id(poll_id: int) -> str:
    poll_part = base64.urlsafe_b64encode(str(poll_id).encode("utf-8")).decode("utf-8").rstrip("=")
    return poll_part + "-" + sign(poll_part)


def decode_poll_code(code: str) -> int:
    parts = code.split("-")

    if len(parts) != 2:
        raise NotFoundError("Голосование не найдено.")

    poll_part = parts[0]
    signature = parts[1]

    if not hmac.compare_digest(signature, sign(poll_part)):
        raise NotFoundError("Голосование не найдено.")

    try:
        padding = "=" * (-len(poll_part) % 4)
        return int(base64.urlsafe_b64decode(poll_part + padding).decode("utf-8"))
    except ValueError:
        raise NotFoundError("Голосование не найдено.")
