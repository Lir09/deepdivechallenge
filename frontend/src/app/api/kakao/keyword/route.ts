import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();
  const apiKey = process.env.KAKAO_REST_API_KEY;

  if (!query) {
    return NextResponse.json({ documents: [] });
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "KAKAO_REST_API_KEY is missing." },
      { status: 500 }
    );
  }

  const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
  url.searchParams.set("query", query);
  url.searchParams.set("size", "7");

  const response = await fetch(url, {
    headers: {
      Authorization: `KakaoAK ${apiKey}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch Kakao keyword results." },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json({ documents: data.documents ?? [] });
}
