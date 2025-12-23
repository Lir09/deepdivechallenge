from fastapi import FastAPI
from app.routers import route, feedback

app = FastAPI(title="Minimum Burden Path API", version="0.1.0")

app.include_router(route.router, prefix="/route", tags=["route"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])

@app.get("/health")
def health():
    return {"ok": True}
