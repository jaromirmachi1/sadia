"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const HERO_POSTER = "/media/hero-poster.webp";
const HERO_POSTER_MOBILE = "/media/hero-poster-mobile.webp";

function isMobileViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function pickVideoSrc() {
  if (isMobileViewport()) {
    return "/media/hero-mobile.mp4";
  }

  const probe = document.createElement("video");

  if (probe.canPlayType('video/webm; codecs="vp9"') !== "") {
    return "/media/hero.webm";
  }

  return "/media/hero.mp4";
}

function pickPosterSrc() {
  return isMobileViewport() ? HERO_POSTER_MOBILE : HERO_POSTER;
}

type HeroVideoBackgroundProps = {
  alt: string;
};

export function HeroVideoBackground({ alt }: HeroVideoBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoPoster, setVideoPoster] = useState(HERO_POSTER);

  const showVideo = mounted && reduceMotion !== true;
  const posterAlt = mounted && reduceMotion === true ? alt : "";

  useEffect(() => {
    setMounted(true);
    setVideoPoster(pickPosterSrc());
  }, []);

  useEffect(() => {
    if (!showVideo) {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.src = pickVideoSrc();
    video.load();

    const handleReady = () => {
      setVideoReady(true);
    };

    const handleCanPlay = () => {
      void video.play().catch(() => {});
    };

    video.addEventListener("loadeddata", handleReady, { once: true });
    video.addEventListener("canplay", handleCanPlay, { once: true });

    return () => {
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [showVideo]);

  return (
    <div className="absolute inset-0 saturate-[0.72]">
      <Image
        src={HERO_POSTER}
        alt={posterAlt}
        aria-hidden={posterAlt ? undefined : true}
        fill
        priority
        sizes="100vw"
        className="hidden object-cover object-center md:block"
      />
      <Image
        src={HERO_POSTER_MOBILE}
        alt={posterAlt}
        aria-hidden={posterAlt ? undefined : true}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center md:hidden"
      />

      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={videoPoster}
          aria-hidden
          className={cn(
            "absolute inset-0 size-full object-cover object-center transition-opacity duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)]",
            videoReady ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null}
    </div>
  );
}
