"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAPS_API_KEY;

type Coordinate = { lat: number; lng: number };

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (cb: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (
          container: HTMLElement,
          options: Record<string, unknown>
        ) => unknown;
        Marker: new (options: Record<string, unknown>) => unknown;
        Polyline: new (options: Record<string, unknown>) => unknown;
        LatLngBounds: new () => {
          extend: (latlng: unknown) => void;
        };
      };
    };
  }
}

let kakaoSdkPromise: Promise<void> | null = null;

function loadKakaoSdk(appKey: string): Promise<void> {
  if (kakaoSdkPromise) {
    return kakaoSdkPromise;
  }

  kakaoSdkPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Kakao Maps SDK can only load in the browser."));
      return;
    }

    if (window.kakao?.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.dataset.kakaoMap = "true";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;

    script.onload = () => {
      if (!window.kakao?.maps?.load) {
        reject(new Error("Kakao Maps SDK loaded, but maps API is missing."));
        return;
      }

      window.kakao.maps.load(() => resolve());
    };

    script.onerror = () => reject(new Error("Failed to load Kakao Maps SDK."));

    document.head.appendChild(script);
  });

  return kakaoSdkPromise;
}

export default function KakaoMap({
  start,
  end,
  path,
}: {
  start?: Coordinate | null;
  end?: Coordinate | null;
  path?: Coordinate[] | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown | null>(null);
  const startMarkerRef = useRef<unknown | null>(null);
  const endMarkerRef = useRef<unknown | null>(null);
  const pathRef = useRef<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);


  useEffect(() => {
    if (!KAKAO_APP_KEY) {
      setError("NEXT_PUBLIC_KAKAO_MAPS_API_KEY is missing.");
      return;
    }

    let isMounted = true;

    loadKakaoSdk(KAKAO_APP_KEY)
      .then(() => {
        if (!isMounted || !containerRef.current) {
          return;
        }
        if (!mapRef.current) {
          const center = new window.kakao.maps.LatLng(
            start?.lat ?? 36.3504119,
            start?.lng ?? 127.3845475
          );
          mapRef.current = new window.kakao.maps.Map(containerRef.current, {
            center,
            level: 3,
          });
          setMapReady(true);
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          setError(err.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);



  const hasCoords = useMemo(() => Boolean(start || end), [start, end]);

  useEffect(() => {
    if (!mapRef.current || !window.kakao?.maps || !hasCoords || !mapReady) {
      return;
    }

    if (startMarkerRef.current) {
      (startMarkerRef.current as { setMap: (map: unknown) => void }).setMap(
        null
      );
    }
    if (endMarkerRef.current) {
      (endMarkerRef.current as { setMap: (map: unknown) => void }).setMap(null);
    }
    if (pathRef.current) {
      (pathRef.current as { setMap: (map: unknown) => void }).setMap(null);
    }

    const bounds = new window.kakao.maps.LatLngBounds();
    if (start) {
      const position = new window.kakao.maps.LatLng(start.lat, start.lng);
      startMarkerRef.current = new window.kakao.maps.Marker({
        position,
        map: mapRef.current,
      });
      bounds.extend(position);
    }
    if (end) {
      const position = new window.kakao.maps.LatLng(end.lat, end.lng);
      endMarkerRef.current = new window.kakao.maps.Marker({
        position,
        map: mapRef.current,
      });
      bounds.extend(position);
    }
    if (path && path.length > 0) {
      const pathLatLng = path.map(
        (point) => new window.kakao.maps.LatLng(point.lat, point.lng)
      );
      pathRef.current = new window.kakao.maps.Polyline({
        path: pathLatLng,
        strokeWeight: 5,
        strokeColor: "#f59e0b",
        strokeOpacity: 0.9,
        strokeStyle: "solid",
      });
      (pathRef.current as { setMap: (map: unknown) => void }).setMap(
        mapRef.current
      );
      pathLatLng.forEach((point) => bounds.extend(point));
    }

    if ((bounds as { extend: (latlng: unknown) => void }).extend) {
      (mapRef.current as { setBounds: (bounds: unknown) => void }).setBounds(
        bounds
      );
    }
  }, [start, end, path, hasCoords, mapReady]);

  if (error) {
    return (
      <div className="flex h-[420px] w-full items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full rounded-3xl border border-zinc-200 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.6)]"
    />
  );
}
