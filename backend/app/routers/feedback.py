from pydantic import BaseModel, Field
from typing import List, Literal

Profile = Literal["wheelchair", "crutch", "stroller", "senior", "default"]

class FeedbackRequest(BaseModel):
    route_id: str
    profile: Profile = "default"
    rating: int = Field(ge=1, le=5)  # 1~5
    tags: List[str] = Field(default_factory=list)  # ["slope", "stairs", "unsafe", ...]

class FeedbackResponse(BaseModel):
    saved: bool
