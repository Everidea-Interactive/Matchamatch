"use client";

import { SKINS } from "@matchamatch/game-core";
import { ScannerPanel } from "@/components/scanner/scanner-panel";
import {
  OnboardingModal,
  type OnboardingStep,
} from "@/components/shared/onboarding-modal";
import { SortBoard } from "@/components/sort/sort-board";
import { TopNav } from "@/components/shared/top-nav";
import { useMatchamatchApp } from "@/hooks/use-matchamatch-app";
import { postToHost } from "@/lib/embed/bridge";
import { useEffect, useState } from "react";

const ONBOARDING_STORAGE_KEY = "matchamatch.onboarding.v1";
const ONBOARDING_STORAGE_VALUE = "seen";

export function MatchamatchApp({ mode }: { mode: "full" | "embed" }) {
  const {
    activeLevel,
    activeTab,
    applyScannerResult,
    currentBoardLevelIndex,
    onCupPress,
    openCompletedDailyGameScanFlow,
    openRetryCaptureFlow,
    pendingRetryRescueLevelIndex,
    profile,
    recentUnlockedSkinIds,
    resetToLevelOne,
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
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("welcome");
  const [tutorialResetKey, setTutorialResetKey] = useState(0);

  function markOnboardingSeen() {
    window.localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      ONBOARDING_STORAGE_VALUE,
    );
  }

  function closeOnboarding() {
    markOnboardingSeen();
    setIsOnboardingOpen(false);
  }

  function openTutorial() {
    setOnboardingStep("tutorial");
    setTutorialResetKey((current) => current + 1);
    setIsOnboardingOpen(true);
  }

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

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const hasSeenOnboarding =
        window.localStorage.getItem(ONBOARDING_STORAGE_KEY) ===
        ONBOARDING_STORAGE_VALUE;

      if (hasSeenOnboarding) {
        return;
      }

      setOnboardingStep("welcome");
      setIsOnboardingOpen(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!isOnboardingOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        markOnboardingSeen();
        setIsOnboardingOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOnboardingOpen]);

  if (!activeLevel || !profile || !sortState) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center px-4 py-8 sm:min-h-screen">
        <p className="text-base font-medium text-[var(--mm-sage-deep)]">
          Loading...
        </p>
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
      <div className="mm-shell-in relative overflow-hidden rounded-[30px] border border-[var(--mm-border)] bg-[linear-gradient(180deg,var(--mm-shell-top),var(--mm-shell-bottom))] p-2.5 shadow-[0_20px_48px_rgba(var(--mm-shadow-rgb),0.08)] backdrop-blur-sm sm:rounded-[36px] sm:p-4 sm:shadow-[0_24px_64px_rgba(var(--mm-shadow-rgb),0.1)]">
        <div
          aria-hidden={isOnboardingOpen}
          inert={isOnboardingOpen ? true : undefined}
        >
          <TopNav
            activeTab={activeTab}
            leftAction={{
              ariaLabel: "Open account",
              href: "/account",
              icon: "account",
            }}
            onOpenHelp={openTutorial}
            onTabChange={setActiveTab}
          />
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
                onOpenCompletedDailyGameScan={openCompletedDailyGameScanFlow}
                onOpenRetryCapture={openRetryCaptureFlow}
                onRestart={restartLevel}
                onResetToLevelOne={resetToLevelOne}
                onTryAgain={tryAgain}
                onUndo={undoMove}
                isDailyGameCompleted={profile.dailyGameCompleted}
                pendingRetryRescueLevelIndex={pendingRetryRescueLevelIndex}
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
              <section className="space-y-3 sm:space-y-4">
                <ScannerPanel onResult={applyScannerResult} />
                <div
                  key={`scanner-feedback-${scannerFeedbackKey}`}
                  className={`rounded-[24px] border border-[var(--mm-border)] bg-[var(--mm-surface-soft)] p-3 sm:p-4 shadow-[0_12px_30px_rgba(var(--mm-shadow-rgb),0.08)] ${
                    scannerFeedbackKey > 0 ? "mm-feedback-in" : ""
                  }`}
                >
                  <p className="text-sm font-medium text-[var(--mm-ink)]">
                    {scannerFeedback}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {SKINS.map((skin) => {
                    const isUnlocked = profile.unlockedSkins.includes(skin.id);
                    const isRecentlyUnlocked = recentUnlockedSkinIds.includes(
                      skin.id,
                    );

                    return (
                      <article
                        key={skin.id}
                        className={`rounded-2xl border border-[var(--mm-border)] bg-[var(--mm-surface-soft)] p-2.5 text-center shadow-[0_12px_28px_rgba(var(--mm-shadow-rgb),0.08)] transition-transform duration-300 ease-[var(--mm-ease-spring)] hover:-translate-y-0.5 sm:p-3 ${
                          isRecentlyUnlocked ? "mm-unlock-pop" : ""
                        }`}
                      >
                        <div
                          className={`text-[1.35rem] sm:text-2xl ${isRecentlyUnlocked ? "mm-score-pop" : ""}`}
                        >
                          {isUnlocked ? skin.emoji : "🔒"}
                        </div>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--mm-ink-strong)] sm:text-[11px] sm:tracking-[0.2em]">
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
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onBack={() => setOnboardingStep("welcome")}
          onClose={closeOnboarding}
          onComplete={closeOnboarding}
          onShowTutorial={openTutorial}
          step={onboardingStep}
          tutorialResetKey={tutorialResetKey}
        />
      </div>
    </main>
  );
}
