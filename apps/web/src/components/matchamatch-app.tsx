"use client";

import { SKINS } from "@matchamatch/game-core";
import { ScannerPanel } from "@/components/scanner/scanner-panel";
import { SortBoard } from "@/components/sort/sort-board";
import { TopNav } from "@/components/shared/top-nav";
import { useMatchamatchApp } from "@/hooks/use-matchamatch-app";
import { postToHost } from "@/lib/embed/bridge";
import { useEffect } from "react";

export function MatchamatchApp({ mode }: { mode: "full" | "embed" }) {
  const {
    activeLevel,
    activeTab,
    applyScannerResult,
    onCupPress,
    profile,
    restartLevel,
    scannerFeedback,
    setActiveTab,
    sortState,
    undoMove,
    useExtraCup,
  } = useMatchamatchApp();

  useEffect(() => {
    if (mode !== "embed") {
      return;
    }

    postToHost({ type: "matchamatch:ready", mode: "embed" });
  }, [mode]);

  useEffect(() => {
    if (mode !== "embed") {
      return;
    }

    postToHost({ type: "matchamatch:tab-change", tab: activeTab });
  }, [activeTab, mode]);

  useEffect(() => {
    if (mode !== "embed" || !profile) {
      return;
    }

    postToHost({
      type: "matchamatch:progress",
      levelIndex: profile.currentLevelIndex,
      dailyScore: profile.dailyScore,
    });
  }, [mode, profile]);

  if (!activeLevel || !profile || !sortState) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <p className="text-base font-medium text-[#546149]">Loading...</p>
      </main>
    );
  }

  return (
    <main
      className={
        mode === "embed"
          ? "mx-auto w-full max-w-md p-4"
          : "mx-auto min-h-screen w-full max-w-md px-4 py-6"
      }
    >
      <div className="rounded-[32px] border border-white/50 bg-white/45 p-4 shadow-[0_24px_80px_rgba(58,67,46,0.14)] backdrop-blur-sm">
        <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "sort" ? (
          <SortBoard
            activeLevel={activeLevel}
            onCupPress={onCupPress}
            onRestart={restartLevel}
            onUndo={undoMove}
            onUsePowerUp={useExtraCup}
            profile={profile}
            sortState={sortState}
          />
        ) : (
          <section className="space-y-4">
            <ScannerPanel onResult={applyScannerResult} />
            <div className="rounded-[24px] bg-white/70 p-4 shadow-sm">
              <p className="text-sm font-medium text-[#4C5A3F]">
                {scannerFeedback}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SKINS.map((skin) => (
                <article
                  key={skin.id}
                  className="rounded-2xl bg-white/70 p-3 text-center shadow-sm"
                >
                  <div className="text-2xl">
                    {profile.unlockedSkins.includes(skin.id) ? skin.emoji : "🔒"}
                  </div>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#3A432E]">
                    {skin.name}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
