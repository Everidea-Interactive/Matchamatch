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
    currentBoardLevelIndex,
    onCupPress,
    profile,
    recentUnlockedSkinIds,
    restartLevel,
    scannerFeedbackKey,
    scannerFeedback,
    setActiveTab,
    scorePulseKey,
    sortState,
    sortFeedbackEvent,
    tryAgain,
    undoMove,
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
      levelIndex: currentBoardLevelIndex,
      dailyScore: profile.dailyScore,
    });
  }, [currentBoardLevelIndex, mode, profile]);

  if (!activeLevel || !profile || !sortState) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center px-4 py-8 sm:min-h-screen">
        <p className="text-base font-medium text-[#546149]">Loading...</p>
      </main>
    );
  }

  const activePanelClassName =
    "[grid-area:1/1] opacity-100 transition-opacity duration-200 ease-[var(--mm-ease-out)]";
  const inactivePanelClassName =
    "[grid-area:1/1] pointer-events-none opacity-0 transition-opacity duration-200 ease-[var(--mm-ease-out)]";

  return (
    <main
      className={
        mode === "embed"
          ? "mx-auto w-full max-w-md p-3 sm:p-4"
          : "mx-auto min-h-[100svh] w-full max-w-md px-2 py-2 sm:min-h-screen sm:px-4 sm:py-6"
      }
      >
      <div className="mm-shell-in rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,rgba(250,251,243,0.78),rgba(235,243,225,0.72))] p-2.5 shadow-[0_22px_56px_rgba(158,166,132,0.18)] backdrop-blur-sm sm:rounded-[36px] sm:p-4 sm:shadow-[0_28px_80px_rgba(158,166,132,0.18)]">
        <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="grid" data-testid="tab-panel">
          <div
            aria-hidden={activeTab !== "sort"}
            className={
              activeTab === "sort"
                ? activePanelClassName
                : inactivePanelClassName
            }
            inert={activeTab !== "sort" ? true : undefined}
          >
            <SortBoard
              activeLevel={activeLevel}
              activeLevelIndex={currentBoardLevelIndex}
              onCupPress={onCupPress}
              onRestart={restartLevel}
              onTryAgain={tryAgain}
              onUndo={undoMove}
              profile={profile}
              scorePulseKey={scorePulseKey}
              sortState={sortState}
              sortFeedbackEvent={sortFeedbackEvent}
            />
          </div>
          <div
            aria-hidden={activeTab !== "go"}
            className={
              activeTab === "go" ? activePanelClassName : inactivePanelClassName
            }
            inert={activeTab !== "go" ? true : undefined}
          >
            <section className="space-y-4">
              <ScannerPanel onResult={applyScannerResult} />
              <div
                key={`scanner-feedback-${scannerFeedbackKey}`}
                className={`rounded-[24px] bg-white/70 p-4 shadow-sm ${
                  scannerFeedbackKey > 0 ? "mm-feedback-in" : ""
                }`}
              >
                <p className="text-sm font-medium text-[#4C5A3F]">
                  {scannerFeedback}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SKINS.map((skin) => {
                  const isUnlocked = profile.unlockedSkins.includes(skin.id);
                  const isRecentlyUnlocked = recentUnlockedSkinIds.includes(
                    skin.id,
                  );

                  return (
                    <article
                      key={skin.id}
                      className={`rounded-2xl bg-white/70 p-3 text-center shadow-sm transition-transform duration-300 ease-[var(--mm-ease-spring)] hover:-translate-y-0.5 ${
                        isRecentlyUnlocked ? "mm-unlock-pop" : ""
                      }`}
                    >
                      <div className={`text-2xl ${isRecentlyUnlocked ? "mm-score-pop" : ""}`}>
                        {isUnlocked ? skin.emoji : "🔒"}
                      </div>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#3A432E]">
                        {skin.name}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
