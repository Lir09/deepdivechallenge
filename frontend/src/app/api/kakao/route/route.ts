import { NextResponse } from "next/server";

type Coordinate = { lat: number; lng: number };

async function routeWithKakao(origin: Coordinate, destination: Coordinate) {
  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return null;
  }

  const url = new URL("https://apis-navi.kakaomobility.com/v1/directions");
  url.searchParams.append("origin", `${origin.lng},${origin.lat}`);
  url.searchParams.append("destination", `${destination.lng},${destination.lat}`);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `KakaoAK ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Kakao API error:", await response.text());
    return null;
  }

  const data = await response.json();

  if (data.routes?.[0]?.result_code !== 0) {
    return null;
  }

  const sections = data.routes[0].sections;
  const path: Coordinate[] = [];

  for (const section of sections) {
    for (const road of section.roads) {
      for (let i = 0; i < road.vertexes.length; i += 2) {
        path.push({ lng: road.vertexes[i], lat: road.vertexes[i + 1] });
      }
    }
  }

  const summary = data.routes[0].summary;

  return {
    path,
    summary: {
      distance: summary.distance,
      duration: summary.duration,
    },
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  const origin: Coordinate | null = body?.origin ?? null;
  const destination: Coordinate | null = body?.destination ?? null;

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "Origin and destination are required." },
      { status: 400 }
    );
  }

  const result = await routeWithKakao(origin, destination);

  if (result) {
    return NextResponse.json(result);
  }

  return NextResponse.json(
    { error: "Failed to get route from Kakao API." },
    { status: 500 }
  );
}
