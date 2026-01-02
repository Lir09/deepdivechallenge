"use client";

import { useEffect, useMemo, useState } from "react";
import KakaoMap from "@/components/KakaoMap";

type UserTypeId = "senior" | "disabled" | "general";
type Coordinate = { lat: number; lng: number };
type KakaoPlace = {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
};

const COOKIE_KEY = "user_type";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const USER_TYPES: { id: UserTypeId; label: string; helper: string }[] = [
  { id: "senior", label: "노약자", helper: "완만한 이동 경로를 선호해요." },
  { id: "disabled", label: "장애인", helper: "휠체어/보행 보조를 고려해요." },
  { id: "general", label: "일반 보행자", helper: "일반 보행 기준으로 이동해요." },
];

const LABELS: Record<UserTypeId, string> = {
  senior: "노약자",
  disabled: "장애인",
  general: "일반 보행자",
};

function isUserTypeId(value: string | null): value is UserTypeId {
  return value === "senior" || value === "disabled" || value === "general";
}

function readCookie(key: string) {
  const pairs = document.cookie.split("; ");
  for (const pair of pairs) {
    const [name, ...rest] = pair.split("=");
    if (name === key) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}

function writeCookie(key: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${key}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAgeSeconds}`;
}

function formatDistance(meters: number) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${meters}m`;
}

function formatDuration(seconds: number) {
  const minutes = Math.round(seconds / 60);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return `${hours}시간 ${rest}분`;
  }
  return `${minutes}분`;
}

export default function Home() {
  const [selected, setSelected] = useState<UserTypeId | null>(null);
  const [ready, setReady] = useState(false);

  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");
  const [startResults, setStartResults] = useState<KakaoPlace[]>([]);
  const [endResults, setEndResults] = useState<KakaoPlace[]>([]);
  const [startCoord, setStartCoord] = useState<Coordinate | null>(null);
  const [endCoord, setEndCoord] = useState<Coordinate | null>(null);
  const [routePath, setRoutePath] = useState<Coordinate[]>([]);
  const [routeSummary, setRouteSummary] = useState<{
    distance: number;
    duration: number;
  } | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  useEffect(() => {
    const saved = readCookie(COOKIE_KEY);
    if (isUserTypeId(saved)) {
      setSelected(saved);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setStartCoord(next);
        if (!startQuery) {
          setStartQuery("현재 위치");
        }
      },
      () => {
        setStartQuery((prev) => (prev ? prev : "현재 위치"));
      }
    );
  }, []);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      if (!startQuery || startQuery === "현재 위치") {
        setStartResults([]);
        return;
      }

      fetch(`/api/kakao/keyword?query=${encodeURIComponent(startQuery)}`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((data: { documents: KakaoPlace[] }) => {
          setStartResults(data.documents ?? []);
        })
        .catch(() => {
          setStartResults([]);
        });
    }, 350);

    return () => window.clearTimeout(handler);
  }, [startQuery]);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      if (!endQuery) {
        setEndResults([]);
        return;
      }

      fetch(`/api/kakao/keyword?query=${encodeURIComponent(endQuery)}`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((data: { documents: KakaoPlace[] }) => {
          setEndResults(data.documents ?? []);
        })
        .catch(() => {
          setEndResults([]);
        });
    }, 350);

    return () => window.clearTimeout(handler);
  }, [endQuery]);

  useEffect(() => {
    if (!startCoord || !endCoord) {
      setRoutePath([]);
      setRouteSummary(null);
      return;
    }

    setRouteLoading(true);
    setRouteError(null);

    fetch("/api/kakao/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: startCoord,
        destination: endCoord,
        userType: selected,
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(
        (data: {
          path: Coordinate[];
          summary: { distance: number; duration: number } | null;
        }) => {
          setRoutePath(data.path ?? []);
          setRouteSummary(data.summary ?? null);
        }
      )
      .catch(() => {
        setRouteError("경로를 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
        setRoutePath([]);
        setRouteSummary(null);
      })
      .finally(() => setRouteLoading(false));
  }, [startCoord, endCoord]);

  const selectedLabel = useMemo(
    () => (selected ? LABELS[selected] : "미선택"),
    [selected]
  );

  const handleSelect = (id: UserTypeId) => {
    writeCookie(COOKIE_KEY, id, COOKIE_MAX_AGE_SECONDS);
    setSelected(id);
  };

  const handleStartSelect = (place: KakaoPlace) => {
    setStartQuery(place.place_name);
    setStartResults([]);
    setStartCoord({ lat: Number(place.y), lng: Number(place.x) });
  };

  const handleEndSelect = (place: KakaoPlace) => {
    setEndQuery(place.place_name);
    setEndResults([]);
    setEndCoord({ lat: Number(place.y), lng: Number(place.x) });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStartCoord({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStartQuery("현재 위치");
        setStartResults([]);
      },
      () => {
        setStartQuery("현재 위치");
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f4ef] via-white to-[#f2efe9] px-6 py-16 text-zinc-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <section className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-800">
            Kakao Maps
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Seoul, centered and ready to explore.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600">
            Add your Kakao JavaScript key to{" "}
            <span className="rounded bg-white/70 px-2 py-1 font-mono text-[13px] text-zinc-800 shadow-sm">
              NEXT_PUBLIC_KAKAO_MAPS_API_KEY
            </span>{" "}
            and the map will render on the homepage.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-900">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            선택된 보행자 유형: {selectedLabel}
          </div>
        </section>
        <section className="grid gap-4 rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-[0_24px_60px_-50px_rgba(15,23,42,0.5)]">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              출발지
              <input
                type="text"
                placeholder="예: 서울역"
                value={startQuery}
                onChange={(event) => {
                  setStartQuery(event.target.value);
                  setStartCoord(null);
                }}
                className="h-11 rounded-2xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
            </label>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="h-11 rounded-2xl border border-amber-200 bg-amber-50 px-4 text-sm font-semibold text-amber-900 transition hover:border-amber-300"
            >
              현재 위치로 설정
            </button>
          </div>
          {startResults.length > 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white">
              {startResults.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => handleStartSelect(place)}
                  className="flex w-full flex-col gap-1 border-b border-zinc-100 px-4 py-3 text-left text-sm text-zinc-700 last:border-none hover:bg-amber-50"
                >
                  <span className="text-sm font-semibold text-zinc-900">
                    {place.place_name}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {place.road_address_name || place.address_name}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
            도착지
            <input
              type="text"
              placeholder="예: 서울시청"
              value={endQuery}
              onChange={(event) => {
                setEndQuery(event.target.value);
                setEndCoord(null);
              }}
              className="h-11 rounded-2xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </label>
          {endResults.length > 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white">
              {endResults.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => handleEndSelect(place)}
                  className="flex w-full flex-col gap-1 border-b border-zinc-100 px-4 py-3 text-left text-sm text-zinc-700 last:border-none hover:bg-amber-50"
                >
                  <span className="text-sm font-semibold text-zinc-900">
                    {place.place_name}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {place.road_address_name || place.address_name}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600">
            {routeLoading ? <span>경로 계산 중...</span> : null}
            {routeSummary ? (
              <span>
                예상 거리 {formatDistance(routeSummary.distance)} · 예상 시간{" "}
                {formatDuration(routeSummary.duration)}
              </span>
            ) : null}
            {routeError ? (
              <span className="text-rose-500">{routeError}</span>
            ) : null}
          </div>
        </section>
        <KakaoMap start={startCoord} end={endCoord} path={routePath} />
      </main>
      {ready && !selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.6)]">
            <div className="mb-5 flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
                User Type
              </p>
              <h2 className="text-2xl font-semibold text-zinc-900">
                보행자 유형을 선택해주세요.
              </h2>
              <p className="text-sm text-zinc-600">
                선택하신 유형은 경로 탐색 기준에 반영됩니다.
              </p>
            </div>
            <div className="grid gap-3">
              {USER_TYPES.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-left text-zinc-900 transition hover:border-amber-300 hover:shadow-[0_16px_40px_-24px_rgba(120,53,15,0.6)] focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <span className="text-base font-semibold">
                    {option.label}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {option.helper}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
