import uuid
from typing import List, Dict

def get_candidate_routes(start_lat: float, start_lon: float, end_lat: float, end_lon: float) -> List[Dict]:
    """
    MVP: 더미 후보 경로 3개 생성
    실제: 외부 라우팅 API(대체경로 포함) 결과를 이 형식으로 맞춰 반환하면 됨.
    """
    # 단순히 start~end를 약간씩 꺾어 3개 경로 만들기
    mid1 = [(start_lat + end_lat) / 2, (start_lon + end_lon) / 2]
    mid2 = [(start_lat + end_lat) / 2 + 0.002, (start_lon + end_lon) / 2 - 0.002]
    mid3 = [(start_lat + end_lat) / 2 - 0.002, (start_lon + end_lon) / 2 + 0.002]

    routes = [
        {
            "route_id": str(uuid.uuid4())[:8],
            "polyline": [[start_lat, start_lon], mid1, [end_lat, end_lon]],
            "distance_m": 480.0,  # 예시
            # 아래는 feature에서 채움
        },
        {
            "route_id": str(uuid.uuid4())[:8],
            "polyline": [[start_lat, start_lon], mid2, [end_lat, end_lon]],
            "distance_m": 650.0,
        },
        {
            "route_id": str(uuid.uuid4())[:8],
            "polyline": [[start_lat, start_lon], mid3, [end_lat, end_lon]],
            "distance_m": 590.0,
        },
    ]
    return routes
