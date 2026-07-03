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
        } catch {
          setIsCameraActive(false);
          setStatus("Camera unavailable");
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
    setStatus(`Switching to ${nextFacingMode === "environment" ? "back" : "front"} camera...`);
    setCameraFacingMode(nextFacingMode);
  }

  return (
    <section className="mm-card-sheen rounded-[28px] bg-[#3A432E] p-4 text-white shadow-[0_20px_50px_rgba(58,67,46,0.22)]">
      <p
        key={status}
        className="mm-feedback-in mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#D7E3CA]"
      >
        {status}
      </p>
      <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-[26px] border border-white/10 bg-black/80 sm:aspect-[4/3]">
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
            className="mm-scan-line pointer-events-none absolute inset-x-3 top-0 h-10 rounded-full bg-[linear-gradient(180deg,rgba(215,227,202,0.2),rgba(215,227,202,0))] blur-sm"
          />
        ) : null}
        <button
          aria-label={`Switch to ${nextFacingMode === "environment" ? "back" : "front"} camera`}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/35 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:bg-black/45 disabled:cursor-not-allowed disabled:opacity-45 sm:hidden"
          disabled={!isCameraActive}
          onClick={toggleCameraFacingMode}
          type="button"
        >
          Flip
        </button>
        <div className="absolute inset-x-0 bottom-5 flex justify-center">
          <button
            aria-label="Capture"
            className="group relative flex h-18 w-18 items-center justify-center rounded-full border-4 border-white/85 bg-white/14 shadow-[0_12px_24px_rgba(0,0,0,0.28)] transition duration-200 hover:scale-[1.02] active:scale-[0.97] disabled:cursor-not-allowed disabled:border-white/25 disabled:bg-white/5"
            disabled={!isCameraActive}
            onClick={captureFrame}
            type="button"
          >
            <span className="absolute inset-[8px] rounded-full bg-[#F7FAF1] transition group-active:inset-[10px] group-disabled:bg-white/35" />
            <span className="sr-only">Capture</span>
          </button>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </section>
  );
}
