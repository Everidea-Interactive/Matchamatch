"use client";

import { analyzeMatchaPixels, type MatchaDetection } from "@matchamatch/game-core";
import { useRef, useState } from "react";

export function ScannerPanel({
  onResult,
}: {
  onResult: (result: MatchaDetection) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState("Camera Ready");

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus("Scanner Active");
      }
    } catch {
      setStatus("Upload fallback ready");
    }
  }

  async function handleFile(file: File) {
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");

      if (!canvas || !context) {
        return;
      }

      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      context.drawImage(bitmap, 0, 0);

      const image = context.getImageData(0, 0, canvas.width, canvas.height);
      const result = analyzeMatchaPixels(image);

      onResult(result);
      setStatus(
        result.isMatcha ? "Matcha Cup Restored!" : "Standard Cup Restored!",
      );
      bitmap.close();
    } catch {
      onResult({
        isMatcha: true,
        centerX: 0,
        centerY: 0,
        matchCount: 0,
      });
      setStatus("Matcha Cup Restored!");
    }
  }

  return (
    <section className="rounded-[28px] bg-[#3A432E] p-4 text-white shadow-[0_20px_50px_rgba(58,67,46,0.22)]">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#D7E3CA]">
        {status}
      </p>
      <div className="mb-3 aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-black/80">
        <video
          ref={videoRef}
          autoPlay
          className="h-full w-full object-cover"
          muted
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="flex gap-2">
        <button
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => void startCamera()}
          type="button"
        >
          Start Camera
        </button>
        <label className="cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#3A432E]">
          Upload
          <input
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];

              if (file) {
                void handleFile(file);
              }
            }}
            type="file"
          />
        </label>
      </div>
    </section>
  );
}
