import os
import csv
from datetime import datetime
from app.schemas.feedback import FeedbackRequest

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
FEEDBACK_PATH = os.path.join(DATA_DIR, "feedback.csv")

def save_feedback_row(req: FeedbackRequest) -> None:
    os.makedirs(DATA_DIR, exist_ok=True)
    file_exists = os.path.exists(FEEDBACK_PATH)

    with open(FEEDBACK_PATH, "a", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        if not file_exists:
            w.writerow(["ts", "route_id", "profile", "rating", "tags"])
        w.writerow([
            datetime.now().isoformat(timespec="seconds"),
            req.route_id,
            req.profile,
            req.rating,
            "|".join(req.tags)
        ])
