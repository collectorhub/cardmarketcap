"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AdvertPlacement,
  AdvertRecord,
  getActiveAdverts,
} from "@/lib/queries/admin/adverts";

export function useAdvertRotation({
  placement,
  fallback = null,
  limit = 20,
}: {
  placement: AdvertPlacement;
  fallback?: AdvertRecord | null;
  limit?: number;
}) {
  const [adverts, setAdverts] =
    useState<AdvertRecord[]>([]);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [rotationInterval, setRotationInterval] =
    useState(10000);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const response =
          await getActiveAdverts(
            placement,
            limit
          );

        if (cancelled) return;

        const nextAdverts =
          response.success &&
          Array.isArray(response.adverts)
            ? response.adverts
            : [];

        setAdverts(nextAdverts);
        setActiveIndex(0);
        setRotationInterval(
          Math.max(
            5000,
            Number(
              response.rotationInterval ||
                10000
            )
          )
        );
      } catch (error) {
        console.error(
          `Failed to load adverts for ${placement}:`,
          error
        );

        if (!cancelled) {
          setAdverts([]);
          setActiveIndex(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [limit, placement]);

  useEffect(() => {
    if (adverts.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        setActiveIndex(
          (current) =>
            (current + 1) %
            adverts.length
        );
      }
    }, rotationInterval);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    adverts.length,
    rotationInterval,
  ]);

  const activeAdvert = useMemo(() => {
    if (adverts.length > 0) {
      return adverts[
        activeIndex % adverts.length
      ];
    }

    return fallback;
  }, [
    activeIndex,
    adverts,
    fallback,
  ]);

  return {
    adverts,
    activeAdvert,
    activeIndex,
    loading,
    rotationInterval,
    setActiveIndex,
  };
}
