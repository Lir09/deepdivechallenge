from fastapi import APIRouter
from app.schemas.route import RouteRecommendRequest, RouteRecommendResponse
from app.services.candidate_routes import get_candidate_routes
from app.services.features import enrich_route_with_features
from app.services.scoring import score_route, load_weights

router = APIRouter()

@router.post("/recommend", response_model=RouteRecommendResponse)
def recommend(req: RouteRecommendRequest):
    # 1) 후보 경로 가져오기 (현재는 더미)
    candidates = get_candidate_routes(req.start.lat, req.start.lon, req.end.lat, req.end.lon)

    # 2) 특징(feature) 계산
    candidates = [enrich_route_with_features(r) for r in candidates]

    # 3) 점수 계산 (부담 최소)
    weights = load_weights(profile=req.profile)

    scored = []
    for r in candidates:
        s, reasons = score_route(r, weights, profile=req.profile)
        r["burden_score"] = s
        r["reasons"] = reasons
        scored.append(r)

    scored.sort(key=lambda x: x["burden_score"])
    chosen = scored[0]

    # alternatives는 상위 3개 정도
    alternatives = scored[1:4]

    return {
        "chosen": chosen,
        "alternatives": alternatives
    }
