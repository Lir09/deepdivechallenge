from pydantic import BaseModel, Field
from typing import List, Literal, Optional

Profile = Literal["wheelchair", "crutch", "stroller", "senior", "default"]

class LatLon(BaseModel):
    lat: float
    lon: float

class RouteRecommendRequest(BaseModel):
    start: LatLon
    end: LatLon
    profile: Profile = "default"

class RoutePath(BaseModel):
    route_id: str
    polyline: List[List[float]]  # [[lat, lon], ...]
    distance_m: float
    burden_score: float = 0.0
    avg_slope: float = 0.0
    stairs_count: int = 0
    sidewalk_ratio: float = 0.0
    reasons: List[str] = Field(default_factory=list)

class RouteRecommendResponse(BaseModel):
    chosen: RoutePath
    alternatives: List[RoutePath] = Field(default_factory=list)
