from typing import Dict, List, Tuple
import math
import random

def haversine_m(a: List[float], b: List[float]) -> float:
    # a,b = [lat, lon]
    R = 6371000.0
    lat1, lon1 = math.radians(a[0]), math.radians(a[1])
    lat2, lon2 = math.radians(b[0]), math.radians(b[1])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    x = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2
    return 2 * R * math.asin(math.sqrt(x))

def enrich_route_with_features(route: Dict) -> Dict:
    """
    실제로는:
      - polyline을 따라 구간별 고도(elevation) 조회 -> avg_slope 계산
      - 계단/보도/안전 데이터 결합
    MVP는 더미/랜덤으로 채움(테스트용)
    """
    poly = route["polyline"]

    # polyline 길이로 거리 재계산(대충)
    dist = 0.0
    for i in range(len(poly)-1):
        dist += haversine_m(poly[i], poly[i+1])
    # 기존 distance_m이 있으면 평균 내거나 덮어써도 됨
    route["distance_m"] = float(route.get("distance_m", dist))

    # 더미 feature (경사/계단/보도비율)
    # 경사: 0.00~0.15 범위 랜덤 (0~15% 정도)
    route["avg_slope"] = round(random.uniform(0.00, 0.15), 4)

    # 계단: 0~2 랜덤
    route["stairs_count"] = int(random.choice([0, 0, 0, 1, 2]))

    # 보도 비율: 0.3~1.0
    route["sidewalk_ratio"] = round(random.uniform(0.3, 1.0), 2)

    return route
