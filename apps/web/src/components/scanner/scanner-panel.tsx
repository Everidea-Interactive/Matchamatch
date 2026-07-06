"use client";

import { analyzeMatchaPixels, type MatchaDetection } from "@matchamatch/game-core";
import { useEffect, useRef, useState } from "react";

export function ScannerPanel({
  onResult,
}: {
  onResult: (result: MatchaDetection) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState("Starting camera...");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<
    "environment" | "user"
  >("environment");

  function stopCameraStream() {
    const stream = streamRef.current;

    if (!stream) {
      return;
    }

    for (const track of stream.getTracks()) {
      track.stop();
    }

    streamRef.current = null;
  }

  function restoreMatchaCup(result: MatchaDetection) {
    onResult({
      ...result,
      isMatcha: true,
    });
    setStatus("Matcha Cup Restored!");
  }

  function analyzeCurrentCanvas() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      restoreMatchaCup({
        isMatcha: true,
        centerX: 0,
        centerY: 0,
        matchCount: 0,
      });
      return;
    }

    const image = context.getImageData(0, 0, canvas.width, canvas.height);
    restoreMatchaCup(analyzeMatchaPixels(image));
  }

  function getCameraErrorStatus(error: unknown) {
    if (error instanceof DOMException) {
      if (error.name === "NotAllowedError") {
        return "Camera permission denied";
      }

      if (error.name === "NotFoundError" || error.name === "OverconstrainedError") {
        return "Requested camera unavailable";
      }
    }

    return "Camera unavailable";
  }

  useEffect(() => {
    const startCameraTimeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          stopCameraStream();

          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: cameraFacingMode },
          });
          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play().catch(() => undefined);
            setIsCameraActive(true);
            setStatus("Scanner Active");
          }
        } catch (error) {
          console.error("Camera start failed.", error);
          setIsCameraActive(false);
          setStatus(getCameraErrorStatus(error));
        }
      })();
    }, 0);

    return () => {
      window.clearTimeout(startCameraTimeoutId);
      stopCameraStream();
    };
  }, [cameraFacingMode]);

  function captureFrame() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const video = videoRef.current;

    if (
      !canvas ||
      !context ||
      !video ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      restoreMatchaCup({
        isMatcha: true,
        centerX: 0,
        centerY: 0,
        matchCount: 0,
      });
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    analyzeCurrentCanvas();
  }

  const isScannerActive = isCameraActive && status === "Scanner Active";
  const nextFacingMode = cameraFacingMode === "environment" ? "user" : "environment";

  function toggleCameraFacingMode() {
    setIsCameraActive(false);
    setStatus(
      `Switching to ${nextFacingMode === "environment" ? "back" : "front"} camera...`,
    );
    setCameraFacingMode(nextFacingMode);
  }

  return (
    <section className="mm-card-sheen rounded-[28px] border border-white/72 bg-[linear-gradient(180deg,var(--mm-card-top),var(--mm-card-bottom))] p-4 text-[var(--mm-ink)] shadow-[0_18px_40px_rgba(var(--mm-shadow-rgb),0.1)]">
      <p
        key={status}
        className="mm-feedback-in mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--mm-sage-deep)]"
      >
        {status}
      </p>
      <div className="relative mb-3 aspect-[5/6] overflow-hidden rounded-[26px] border border-[rgba(255,255,255,0.52)] bg-[#231c16] sm:aspect-[4/3]">
        <video
          ref={videoRef}
          autoPlay
          className="h-full w-full object-cover"
          muted
          playsInline
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,227,202,0.18),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.42))]" />
        {isScannerActive ? (
          <div
            aria-hidden="true"
            className="mm-scan-line pointer-events-none absolute inset-x-3 top-0 h-10 rounded-full bg-[linear-gradient(180deg,rgba(217,228,202,0.34),rgba(217,228,202,0))] blur-sm"
          />
        ) : null}
        <button
          aria-label={`Switch to ${nextFacingMode === "environment" ? "back" : "front"} camera`}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-35 sm:hidden"
          disabled={!isCameraActive}
          onClick={toggleCameraFacingMode}
          type="button"
        >
          <img
            alt=""
            aria-hidden="true"
            className="h-8 w-8 invert drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
            src="/icons/camera-rotate-svgrepo-com.svg"
          />
        </button>
        <div className="absolute inset-x-0 bottom-5 flex justify-center">
          <button
            aria-label="Capture"
            className="group relative flex h-18 w-18 items-center justify-center rounded-full border-4 border-[rgba(252,246,238,0.9)] bg-[rgba(183,200,156,0.22)] shadow-[0_12px_24px_rgba(0,0,0,0.28)] transition duration-200 hover:scale-[1.02] active:scale-[0.97] disabled:cursor-not-allowed disabled:border-[rgba(252,246,238,0.3)] disabled:bg-[rgba(255,255,255,0.06)]"
            disabled={!isCameraActive}
            onClick={captureFrame}
            type="button"
          >
            <span className="absolute inset-[8px] rounded-full bg-[linear-gradient(180deg,var(--mm-sage-soft),var(--mm-sage))] transition group-active:inset-[10px] group-disabled:bg-[rgba(255,255,255,0.35)]" />
            <span className="sr-only">Capture</span>
          </button>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </section>
  );
}
