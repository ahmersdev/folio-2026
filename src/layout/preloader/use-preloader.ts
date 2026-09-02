import { useCallback, useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import {
  ANNOUNCE_STEP,
  EXIT_DURATION_MS,
  MAX_TIMEOUT_MS,
  MIN_DISPLAY_MS,
  SESSION_STORAGE_KEY,
  SLOW_LOAD_THRESHOLD_MS,
} from "./preloader.data";
import { TPreloaderPhase } from "./preloader.interface";

export default function usePreloader() {
  const { progress, active, loaded } = useProgress();

  const [phase, setPhase] = useState<TPreloaderPhase>("loading");
  const [isSlow, setIsSlow] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [prevProgress, setPrevProgress] = useState(progress);
  const [announcedProgress, setAnnouncedProgress] = useState(0);

  const startedAtRef = useRef(0);
  const skipMinDurationRef = useRef(false);
  const hasStartedRef = useRef(false);

  const finishLoading = useCallback(() => {
    setPhase((current) => (current === "loading" ? "exiting" : current));
  }, []);

  useEffect(() => {
    startedAtRef.current = Date.now();
    skipMinDurationRef.current =
      window.sessionStorage.getItem(SESSION_STORAGE_KEY) === "1";
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(finishLoading, MAX_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [finishLoading]);

  useEffect(() => {
    if (phase !== "loading") return;

    const timeout = window.setTimeout(
      () => setIsSlow(true),
      SLOW_LOAD_THRESHOLD_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [phase]);

  if (progress !== prevProgress) {
    setPrevProgress(progress);

    const nextDisplayProgress = Math.max(
      displayProgress,
      Math.min(100, Math.round(progress)),
    );
    if (nextDisplayProgress !== displayProgress) {
      setDisplayProgress(nextDisplayProgress);

      const bucket =
        Math.floor(nextDisplayProgress / ANNOUNCE_STEP) * ANNOUNCE_STEP;
      if (bucket > announcedProgress) setAnnouncedProgress(bucket);
    }
  }

  useEffect(() => {
    if (active || loaded > 0) hasStartedRef.current = true;

    if (!hasStartedRef.current || active || progress < 100) return;

    const elapsed = Date.now() - startedAtRef.current;
    const remaining = skipMinDurationRef.current ? 0 : MIN_DISPLAY_MS - elapsed;

    if (remaining <= 0) {
      finishLoading();
      return;
    }

    const timeout = window.setTimeout(finishLoading, remaining);
    return () => window.clearTimeout(timeout);
  }, [progress, active, loaded, finishLoading]);

  useEffect(() => {
    if (phase !== "exiting") return;

    const timeout = window.setTimeout(() => {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, "1");
      setPhase("hidden");
    }, EXIT_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase === "hidden") return;

    document.documentElement.classList.add("overflow-hidden");
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [phase]);

  return { phase, progress: displayProgress, announcedProgress, isSlow };
}
