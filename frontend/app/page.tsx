import type { CSSProperties } from "react";

export default function Home() {
  return (
    <div className="min-h-screen text-[15px] leading-7 text-[color:var(--ink)]">
      <header className="relative overflow-hidden pb-16">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-6xl px-6 pt-10 md:px-10">
          <nav className="flex items-center justify-between text-sm">
            <div className="font-display text-lg font-semibold tracking-tight">
              Minimum Burden Path
            </div>
            <div className="hidden items-center gap-6 text-[13px] font-medium text-[color:var(--ink-muted)] md:flex">
              <span>문제 정의</span>
              <span>서비스 흐름</span>
              <span>핵심 원리</span>
              <span>기술 스택</span>
            </div>
            <button className="rounded-full border border-[color:var(--ink)]/15 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.2em]">
              데모 준비중
            </button>
          </nav>

          <div className="mt-16 grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
            <div className="space-y-7">
              <p className="reveal text-[13px] font-semibold uppercase tracking-[0.35em] text-[color:var(--terra)]">
                AI 경로 추천
              </p>
              <h1
                className="font-display reveal text-4xl leading-[1.05] tracking-tight md:text-5xl"
                style={{ "--delay": "0.1s" } as CSSProperties}
              >
                교통약자에게 진짜 편한 길을 제안하는
                <br />
                부담 최소 경로 시스템
              </h1>
              <p
                className="reveal max-w-xl text-[color:var(--ink-muted)]"
                style={{ "--delay": "0.2s" } as CSSProperties}
              >
                거리나 시간만이 아니라 경사, 계단, 노면 상태, 보행 안전까지
                합쳐서 점수를 매깁니다. 위험하고 힘든 길을 피하고, 실제로
                부담이 적은 경로를 추천합니다.
              </p>
              <div
                className="reveal flex flex-wrap gap-3"
                style={{ "--delay": "0.3s" } as CSSProperties}
              >
                <button className="rounded-full bg-[color:var(--ink)] px-6 py-3 text-sm font-semibold text-[color:var(--paper)]">
                  프로젝트 요약 보기
                </button>
                <button className="rounded-full border border-[color:var(--ink)]/20 px-6 py-3 text-sm font-semibold text-[color:var(--ink)]">
                  알고리즘 개요
                </button>
              </div>
            </div>

            <div className="glass reveal glow rounded-[28px] p-6 md:p-8">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                <span>부담 점수 대시보드</span>
                <span>beta</span>
              </div>
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl bg-white/80 p-4">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>최소 부담 경로</span>
                    <span className="text-[color:var(--olive)]">650m</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-[color:var(--clay)]/60">
                    <div className="h-2 w-[78%] rounded-full bg-[color:var(--olive)]" />
                  </div>
                  <p className="mt-3 text-xs text-[color:var(--ink-muted)]">
                    경사 거의 없음 · 계단 없음 · 보행환경 안전
                  </p>
                </div>
                <div className="rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>일반 최단 경로</span>
                    <span className="text-[color:var(--terra)]">480m</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-[color:var(--clay)]/60">
                    <div className="h-2 w-[52%] rounded-full bg-[color:var(--terra)]" />
                  </div>
                  <p className="mt-3 text-xs text-[color:var(--ink-muted)]">
                    급경사 · 계단 포함 · 위험 교차로
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-white/70 p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                    점수 요소
                  </p>
                  <p className="mt-2 font-semibold">경사 · 계단 · 노면</p>
                </div>
                <div className="rounded-xl bg-white/70 p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                    데이터
                  </p>
                  <p className="mt-2 font-semibold">지도 · 공공 · 고도</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 md:px-10">
        <section className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "현실의 불편",
              copy: "교통약자는 오르막, 계단, 울퉁불퉁한 노면 때문에 이동이 크게 힘듭니다.",
            },
            {
              title: "지도 앱의 한계",
              copy: "대부분 시간과 거리 기준으로만 안내해 실제로는 위험한 길을 선택하게 됩니다.",
            },
            {
              title: "우리의 정의",
              copy: "경사·계단·보행환경까지 반영한 부담 점수로 진짜 편한 길을 찾습니다.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="reveal rounded-[24px] border border-[color:var(--ink)]/10 bg-white/70 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
            >
              <h3 className="font-display text-xl">{item.title}</h3>
              <p className="mt-3 text-[color:var(--ink-muted)]">{item.copy}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-center">
          <div className="space-y-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[color:var(--olive)]">
              서비스 흐름
            </p>
            <h2 className="font-display text-3xl leading-tight">
              출발지와 도착지만 입력하면
              <br />
              부담 점수 최소 경로를 계산합니다
            </h2>
            <p className="text-[color:var(--ink-muted)]">
              지도/도로/고도 데이터와 공공 보행 정보를 조합해 구간별 부담
              점수를 만들고, 전체 경로 후보 중 합산 점수가 가장 낮은 길을
              추천합니다.
            </p>
          </div>
          <div className="rounded-[28px] border border-[color:var(--ink)]/10 bg-white/70 p-6">
            <div className="space-y-4">
              {[
                "출발지·도착지 입력",
                "구간별 부담 점수 계산",
                "후보 경로 비교",
                "최소 부담 경로 추천",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-2xl bg-[color:var(--paper)]/80 p-4 text-sm font-semibold"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--sun)] text-[12px] font-bold text-[color:var(--ink)]">
                    0{index + 1}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] bg-[color:var(--olive)] p-8 text-white">
            <p className="text-[12px] font-semibold uppercase tracking-[0.3em]">
              핵심 원리
            </p>
            <h3 className="font-display mt-4 text-2xl">
              부담 점수는 이렇게 계산합니다
            </h3>
            <p className="mt-4 text-sm text-white/80">
              계단은 사실상 불가 구간으로 큰 페널티를 주고, 경사도는
              이동보조기 사용자에게 가장 큰 부담이므로 높은 가중치를
              부여합니다.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              {
                title: "경사도",
                copy: "오르막/내리막은 휠체어·목발에 치명적 → 높은 가중치",
              },
              {
                title: "계단 여부",
                copy: "계단은 사실상 막힌 길 수준의 페널티",
              },
              {
                title: "보행 환경",
                copy: "보도 유무, 차도 분리, 위험 교차로까지 포함",
              },
              {
                title: "노면 상태",
                copy: "진동·충격 요소(턱, 포트홀, 블록형 보도)",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-[color:var(--ink)]/10 bg-white/70 p-5"
              >
                <h4 className="font-display text-lg">{item.title}</h4>
                <p className="mt-2 text-[color:var(--ink-muted)]">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[color:var(--terra)]">
              직관적 예시
            </p>
            <h2 className="font-display text-3xl">
              더 멀더라도 더 안전한 길
            </h2>
            <p className="text-[color:var(--ink-muted)]">
              480m 최단 경로는 급경사와 계단을 포함합니다. 650m 경로는 조금
              돌아가지만 경사와 계단이 없고 보행환경이 안전해 실제 체감
              부담은 훨씬 낮습니다.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[26px] border border-[color:var(--ink)]/10 bg-white/70 p-6">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-lg">최단 경로</h4>
                <span className="text-sm font-semibold text-[color:var(--terra)]">
                  480m
                </span>
              </div>
              <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
                급경사 · 계단 포함 · 위험 교차로
              </p>
            </div>
            <div className="rounded-[26px] bg-[color:var(--ink)] p-6 text-[color:var(--paper)]">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-lg">부담 최소 경로</h4>
                <span className="text-sm font-semibold text-[color:var(--sun)]">
                  650m
                </span>
              </div>
              <p className="mt-2 text-sm text-[color:var(--paper)]/80">
                경사 거의 없음 · 계단 없음 · 보행환경 안전
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div className="rounded-[28px] border border-[color:var(--ink)]/10 bg-white/70 p-8">
            <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[color:var(--olive)]">
              기술 구성
            </p>
            <h3 className="font-display mt-3 text-2xl">
              프론트와 백엔드 역할 분담
            </h3>
            <div className="mt-6 grid gap-4 text-sm">
              <div className="flex items-start gap-4">
                <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--terra)]" />
                <div>
                  <p className="font-semibold">프론트엔드</p>
                  <p className="text-[color:var(--ink-muted)]">
                    Next.js (TypeScript) 기반 UI/UX, 경로 시각화, 사용자 입력
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--olive)]" />
                <div>
                  <p className="font-semibold">백엔드</p>
                  <p className="text-[color:var(--ink-muted)]">
                    Python REST API, 데이터 수집·부담 점수 계산·추천 알고리즘
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--sun)]" />
                <div>
                  <p className="font-semibold">통합</p>
                  <p className="text-[color:var(--ink-muted)]">
                    API 연결로 실시간 경로 추천과 개인화 피드백 수집
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-[24px] border border-[color:var(--ink)]/10 bg-white/70 p-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[color:var(--terra)]">
                확장 계획
              </p>
              <p className="mt-3 text-[color:var(--ink-muted)]">
                사용자 피드백(힘들었음/괜찮았음)을 받아 개인 맞춤형
                부담 점수로 고도화합니다.
              </p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--ink)]/10 bg-white/70 p-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[color:var(--olive)]">
                자료 근거
              </p>
              <p className="mt-3 text-[color:var(--ink-muted)]">
                교통약자 이동권 정책, AI 교통 시스템 사례, 불편 지수
                산정 연구를 기반으로 설계합니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[color:var(--ink)]/10 bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-xs text-[color:var(--ink-muted)] md:px-10">
          <p>Minimum Burden Path · 교통약자 보행 부담 최소 경로</p>
          <p>Next.js (TS) · Python REST API · 2025</p>
        </div>
      </footer>
    </div>
  );
}
