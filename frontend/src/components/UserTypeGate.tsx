"use client";

import { useEffect, useState } from "react";

type UserTypeId = "senior" | "disabled" | "general";

const COOKIE_KEY = "user_type";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const USER_TYPES: { id: UserTypeId; label: string; helper: string }[] = [
  { id: "senior", label: "노약자", helper: "완만한 이동 경로를 선호해요." },
  { id: "disabled", label: "장애인", helper: "휠체어/보행 보조를 고려해요." },
  { id: "general", label: "일반 보행자", helper: "일반 보행 기준으로 이동해요." },
];

function isUserTypeId(value: string | null): value is UserTypeId {
  return value === "senior" || value === "disabled" || value === "general";
}

function readCookie(key: string) {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${key.replace(/([$?*|{}()\\[\\]\\\\/+.^])/g, "\\$1")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(key: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}`;
}

export default function UserTypeGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<UserTypeId | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = readCookie(COOKIE_KEY);
    if (isUserTypeId(saved)) {
      setSelected(saved);
    }
    setReady(true);
  }, []);

  const handleSelect = (id: UserTypeId) => {
    writeCookie(COOKIE_KEY, id, COOKIE_MAX_AGE_SECONDS);
    setSelected(id);
  };

  if (!ready || !selected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f7f4ef] via-white to-[#f2efe9] px-6 py-16 text-zinc-900">
        <main className="mx-auto flex w-full max-w-2xl flex-col gap-8">
          <section className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-800">
              User Type
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              보행자 유형을 먼저 선택해주세요.
            </h1>
            <p className="text-base leading-7 text-zinc-600">
              선택하신 유형은 출발/도착 경로 탐색에 반영됩니다.
            </p>
          </section>
          <section className="grid gap-4 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-[0_28px_80px_-60px_rgba(15,23,42,0.55)]">
            {USER_TYPES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-left text-zinc-900 transition hover:border-amber-300 hover:shadow-[0_16px_40px_-24px_rgba(120,53,15,0.6)] focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <span className="text-base font-semibold">{option.label}</span>
                <span className="text-sm text-zinc-500">{option.helper}</span>
              </button>
            ))}
          </section>
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
