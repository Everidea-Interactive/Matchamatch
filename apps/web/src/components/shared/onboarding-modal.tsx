"use client";

import Image from "next/image";
import { useState } from "react";

export type OnboardingStep = "welcome" | "tutorial";
type TutorialPage = "sort" | "go";

function TutorialCarousel({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [tutorialPage, setTutorialPage] = useState<TutorialPage>("sort");
  const isSortPage = tutorialPage === "sort";

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--mm-muted)]">
        Quick Tour
      </p>
      <h2
        className="mt-3 max-w-[12ch] text-[1.85rem] leading-[0.96] font-bold tracking-[-0.05em] text-[var(--mm-ink-strong)] sm:text-[2rem]"
        id="onboarding-tutorial-title"
      >
        How to play Matchamatch
      </h2>
      <article
        className="mt-4 rounded-[24px] border border-[rgba(226,214,199,0.94)] bg-[rgba(255,249,241,0.74)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
        id="onboarding-tutorial-description"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--mm-sage-deep)]">
          {isSortPage ? "Step 1" : "Step 2"}
        </p>
        <h3 className="mt-2 text-[1.55rem] leading-none font-bold tracking-[-0.04em] text-[var(--mm-ink-strong)]">
          {isSortPage ? "Sort" : "Go"}
        </h3>
        {isSortPage ? (
          <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--mm-ink)]">
            <p className="font-medium text-[var(--mm-ink-strong)]">
              Group same layers together before moves run out.
            </p>
            <div className="grid gap-2">
              <p>
                <span className="font-semibold text-[var(--mm-ink-strong)]">1.</span> Tap cup
                you want to pour from.
              </p>
              <p>
                <span className="font-semibold text-[var(--mm-ink-strong)]">2.</span> Tap cup
                you want to pour into.
              </p>
              <p>
                <span className="font-semibold text-[var(--mm-ink-strong)]">3.</span> Use Undo
                or Restart if board gets messy.
              </p>
            </div>
            <p className="rounded-[18px] bg-[rgba(184,201,157,0.16)] px-3 py-2 text-[13px] leading-5 text-[var(--mm-ink-strong)]">
              Out of retries? Go capture matcha to earn one back.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--mm-ink)]">
            <p className="font-medium text-[var(--mm-ink-strong)]">
              Use camera to grab fast rewards and recover failed puzzle runs.
            </p>
            <div className="grid gap-2">
              <p>
                <span className="font-semibold text-[var(--mm-ink-strong)]">1.</span> Point
                camera at drink and press Capture.
              </p>
              <p>
                <span className="font-semibold text-[var(--mm-ink-strong)]">2.</span> Good scan
                gives +100 points right away.
              </p>
              <p>
                <span className="font-semibold text-[var(--mm-ink-strong)]">3.</span> Keep
                capturing to unlock more cup skins.
              </p>
            </div>
            <p className="rounded-[18px] bg-[rgba(184,201,157,0.16)] px-3 py-2 text-[13px] leading-5 text-[var(--mm-ink-strong)]">
              Came from failed puzzle? Successful capture restores retry and sends you back.
            </p>
          </div>
        )}
      </article>
      <div aria-hidden="true" className="mt-5 flex items-center justify-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isSortPage ? "bg-[var(--mm-sage-deep)]" : "bg-[rgba(154,134,117,0.28)]"
          }`}
          data-testid={isSortPage ? "tutorial-dot-active" : "tutorial-dot"}
        />
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isSortPage ? "bg-[rgba(154,134,117,0.28)]" : "bg-[var(--mm-sage-deep)]"
          }`}
          data-testid={isSortPage ? "tutorial-dot" : "tutorial-dot-active"}
        />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <button
          className="mm-button w-full rounded-[16px] border border-[var(--mm-border)] bg-[var(--mm-surface-raised)] px-4 py-3 text-sm font-semibold text-[var(--mm-ink-strong)] shadow-[0_10px_20px_rgba(var(--mm-shadow-rgb),0.08)] sm:rounded-[18px] sm:shadow-[0_12px_24px_rgba(var(--mm-shadow-rgb),0.1)]"
          onClick={isSortPage ? onBack : () => setTutorialPage("sort")}
          type="button"
        >
          Back
        </button>
        {isSortPage ? (
          <button
            autoFocus
            className="mm-button w-full rounded-[16px] bg-[linear-gradient(180deg,var(--mm-sage),var(--mm-sage-deep))] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(123,141,93,0.22)] sm:rounded-[18px] sm:shadow-[0_16px_30px_rgba(123,141,93,0.22)]"
            onClick={() => setTutorialPage("go")}
            type="button"
          >
            Next
          </button>
        ) : (
          <button
            autoFocus
            className="mm-button w-full rounded-[16px] bg-[linear-gradient(180deg,var(--mm-sage),var(--mm-sage-deep))] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(123,141,93,0.22)] sm:rounded-[18px] sm:shadow-[0_16px_30px_rgba(123,141,93,0.22)]"
            onClick={onComplete}
            type="button"
          >
            Start playing
          </button>
        )}
      </div>
    </div>
  );
}

export function OnboardingModal({
  isOpen,
  step,
  onBack,
  onClose,
  onComplete,
  onShowTutorial,
  tutorialResetKey,
}: {
  isOpen: boolean;
  step: OnboardingStep;
  onBack: () => void;
  onClose: () => void;
  onComplete: () => void;
  onShowTutorial: () => void;
  tutorialResetKey: number;
}) {
  if (!isOpen) {
    return null;
  }

  const isWelcomeStep = step === "welcome";
  const titleId = isWelcomeStep ? "onboarding-welcome-title" : "onboarding-tutorial-title";
  const descriptionId = isWelcomeStep
    ? "onboarding-welcome-description"
    : "onboarding-tutorial-description";

  return (
    <div className="mm-modal-overlay-in absolute inset-0 z-50 flex items-center justify-center rounded-[30px] bg-[radial-gradient(circle_at_top,rgba(255,250,244,0.8),rgba(239,228,214,0.94))] px-4 py-5 backdrop-blur-[2px] sm:rounded-[36px] sm:px-5 sm:py-6">
      <div
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="mm-card-sheen mm-modal-in relative w-full max-w-[24rem] overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,var(--mm-card-top),var(--mm-card-bottom))] px-5 py-6 shadow-[0_20px_48px_rgba(var(--mm-shadow-rgb),0.14)] sm:max-w-[25.5rem] sm:px-6 sm:py-7 sm:shadow-[0_24px_60px_rgba(var(--mm-shadow-rgb),0.16)]"
        role="dialog"
      >
        <button
          aria-label="Close onboarding"
          className="mm-button absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(223,208,191,0.96)] bg-[rgba(255,249,241,0.9)] text-lg font-semibold text-[var(--mm-ink-strong)] shadow-[0_10px_20px_rgba(var(--mm-shadow-rgb),0.08)] sm:top-4 sm:right-4"
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        {isWelcomeStep ? (
          <div className="flex flex-col items-center text-center">
            <Image
              alt=""
              aria-hidden="true"
              className="h-auto w-[12.75rem] sm:w-[13.75rem]"
              height={175}
              priority
              src="/icons/Logo.svg"
              unoptimized
              width={208}
            />
            <p
              className="mt-4 max-w-[30ch] text-sm leading-6"
            >
              <span className="font-semibold text-[var(--mm-ink-strong)]" id={titleId}>
                Welcome to Matcha Match!
              </span>
              <br />
              <span className="text-[var(--mm-ink)]" id={descriptionId}>
                Calm cafe puzzler. Sort tea layers, hop into scanner, earn points, then
                rescue retries when cup run goes dry.
              </span>
            </p>
            <div className="mt-5 w-full rounded-[24px] border border-[rgba(226,214,199,0.94)] bg-[rgba(255,249,241,0.74)] p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--mm-sage-deep)]">
                First sip
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--mm-ink)]">
                Start in <span className="font-semibold text-[var(--mm-ink-strong)]">Sort</span>,
                finish cups under move limit, then jump to{" "}
                <span className="font-semibold text-[var(--mm-ink-strong)]">Go</span> for
                scanner rewards.
              </p>
            </div>
            <div className="mt-5 grid w-full gap-2.5">
              <button
                autoFocus
                className="mm-button w-full rounded-[16px] bg-[linear-gradient(180deg,var(--mm-sage),var(--mm-sage-deep))] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(123,141,93,0.22)] sm:rounded-[18px] sm:shadow-[0_16px_30px_rgba(123,141,93,0.22)]"
                onClick={onShowTutorial}
                type="button"
              >
                Show me how
              </button>
              <button
                className="mm-button w-full rounded-[16px] border border-[var(--mm-border)] bg-[var(--mm-surface-raised)] px-4 py-3 text-sm font-semibold text-[var(--mm-ink-strong)] shadow-[0_10px_20px_rgba(var(--mm-shadow-rgb),0.08)] sm:rounded-[18px] sm:shadow-[0_12px_24px_rgba(var(--mm-shadow-rgb),0.1)]"
                onClick={onClose}
                type="button"
              >
                Skip for now
              </button>
            </div>
          </div>
        ) : (
          <TutorialCarousel
            key={tutorialResetKey}
            onBack={onBack}
            onComplete={onComplete}
          />
        )}
      </div>
    </div>
  );
}
