"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

export default function AutoMarqueeText({
  text,
  className,
  speed = 32,
  pauseOnHover = true,
}: {
  text: string;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
}) {
  const viewportRef =
    useRef<HTMLSpanElement | null>(
      null
    );

  const contentRef =
    useRef<HTMLSpanElement | null>(
      null
    );

  const [
    shouldAnimate,
    setShouldAnimate,
  ] = useState(false);

  const [
    duration,
    setDuration,
  ] = useState(8);

  useEffect(() => {
    const viewport =
      viewportRef.current;

    const content =
      contentRef.current;

    if (!viewport || !content) {
      return;
    }

    const measure = () => {
      const overflow =
        content.scrollWidth -
        viewport.clientWidth;

      const animate =
        overflow > 6;

      setShouldAnimate(animate);

      if (animate) {
        const distance =
          content.scrollWidth +
          28;

        setDuration(
          Math.max(
            5,
            distance /
              Math.max(
                10,
                speed
              )
          )
        );
      }
    };

    measure();

    const observer =
      new ResizeObserver(
        measure
      );

    observer.observe(viewport);
    observer.observe(content);

    return () =>
      observer.disconnect();
  }, [speed, text]);

  return (
    <span
      ref={viewportRef}
      title={text}
      className={cn(
        "group/marquee relative block min-w-0 overflow-hidden whitespace-nowrap",
        className
      )}
    >
      <span
        ref={contentRef}
        className={cn(
          "inline-flex min-w-max items-center",
          shouldAnimate &&
            "cmc-auto-marquee-track",
          pauseOnHover &&
            shouldAnimate &&
            "group-hover/marquee:[animation-play-state:paused]"
        )}
        style={
          shouldAnimate
            ? ({
                "--cmc-marquee-duration":
                  `${duration}s`,
              } as React.CSSProperties)
            : undefined
        }
      >
        <span>{text}</span>

        {shouldAnimate ? (
          <>
            <span
              aria-hidden="true"
              className="mx-4 opacity-40"
            >
              •
            </span>

            <span aria-hidden="true">
              {text}
            </span>
          </>
        ) : null}
      </span>

      <style jsx>{`
        .cmc-auto-marquee-track {
          animation: cmc-auto-marquee
            var(
              --cmc-marquee-duration,
              8s
            )
            linear infinite;
          will-change: transform;
        }

        @keyframes cmc-auto-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(
              calc(-50% - 8px)
            );
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .cmc-auto-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </span>
  );
}
