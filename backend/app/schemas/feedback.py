from fastapi import APIRouter
from app.schemas.feedback import FeedbackRequest, FeedbackResponse
from app.services.model import save_feedback_row

router = APIRouter()

@router.post("", response_model=FeedbackResponse)
def feedback(req: FeedbackRequest):
    save_feedback_row(req)
    return {"saved": True}
