from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/login")
async def login(payload: LoginRequest):
    # TODO: validate against DB. For MVP, accept any password and return mock.
    if not payload.email:
        raise HTTPException(status_code=400, detail="Email requerido")
    return {"token": "mock-token", "user": {"email": payload.email, "role": "Residente"}}
