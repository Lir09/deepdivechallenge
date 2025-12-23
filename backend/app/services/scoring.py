import json
import os
from typing import Dict, Tuple, List

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
WEIGHTS_PATH = os.path.join(DATA_DIR, "weights.json")

def load_weights(profile: str = "default") -> Dict:
    with open(WEIGHTS_PATH, "r", encoding="utf-8") as f:
        all_w = json.load(f)
    return all_w.get(profile, all_w["default"])

def score_route(route: Dict, weights: Dict, profile: str = "default") -> Tuple[float, List[str]]:
    """
    route: distance_m, avg_slope, stairs_count, sidewalk_ratio 포함
    score 낮을수록 좋음
    """
    dist = float(route.get("distance_m", 0.0))
    slope = float(route.get("avg_slope", 0.0))
    stairs = int(route.get("stairs_count", 0))
    sidewalk_ratio = float(route.get("sidewalk_ratio", 0.0))

    # 기본 점수
    score = 0.0
    reasons = []

    # 거리
    score += weights["distance"] * dist

    # 경사 (휠체어/목발에게 치명)
    score += weights["slope"] * (slope * 100.0)  # %로 변환해서 반영

    # 계단 (사실상 불가급)
    if stairs > 0:
        score += weights["stairs"] * stairs

    # 보도 비율: 높을수록 좋으니 (1 - ratio)로 페널티
    score += weights["sidewalk"] * (1.0 - sidewalk_ratio) * 100.0

    # 이유(설명) 생성
    reasons.append(f"거리 {dist:.0f}m")
    reasons.append(f"평균 경사 {slope*100:.1f}%")
    reasons.append(f"계단 {stairs}개")
    reasons.append(f"보도 비율 {sidewalk_ratio:.2f}")

    return score, reasons

