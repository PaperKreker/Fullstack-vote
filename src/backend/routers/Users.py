from fastapi import APIRouter, Depends, HTTPException

from Authorization import get_current_user_id
from Database import db_proxy
from dto.UserDTO import UserDTO, UserAddDTO

router = APIRouter()


@router.post("/user/add/")
async def add_user(user_add: UserAddDTO):
    return db_proxy.users.add_user(user_add.username, user_add.password)


@router.get("/me/")
async def get_me(user_id: int = Depends(get_current_user_id)):
    user_data = db_proxy.users.get_user(user_id)

    if not user_data:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    return UserDTO(**user_data)


@router.delete("/me/")
async def delete_me(user_id: int = Depends(get_current_user_id)):
    return db_proxy.users.delete_user(user_id)
