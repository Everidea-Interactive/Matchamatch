import type {
  LevelDefinition,
  LocalProfile,
  SortState,
} from "@matchamatch/game-core";
import Image from "next/image";
import { type CSSProperties } from "react";
import type { SortFeedbackEvent } from "@/hooks/use-matchamatch-app";
import { CupStack } from "./cup-stack";

const MAX_RETRY_LEAVES = 3;

export function SortBoard({
  activeLevel,
  activeLevelIndex,
  onCupPress,
  onOpenRetryCapture,
  onRestart,
  onResetToLevelOne,
  onTryAgain,
  onUndo,
  pendingRetryRescueLevelIndex,
  profile,
  scorePulseKey,
  sortState,
  sortFeedbackEvent,
}: {
  activeLevel: LevelDefinition;
  activeLevelIndex: number;
  onCupPress: (index: number) => void;
  onOpenRetryCapture: () => void;
  onRestart: () => void;
  onResetToLevelOne: () => void;
  onTryAgain: () => void;
  onUndo: () => void;
  pendingRetryRescueLevelIndex: number | null;
  profile: LocalProfile;
  scorePulseKey: number;
  sortState: SortState;
  sortFeedbackEvent: SortFeedbackEvent;
}) {
  const showFailureModal = sortState.status === "failed";
  const isRetryCaptureRequired =
    pendingRetryRescueLevelIndex !== null && profile.retryBudgetRemaining === 0;
  const isInvalidMessage =
    sortFeedbackEvent.kind === "invalid" || sortFeedbackEvent.kind === "empty";
  const isSuccessMessage = sortFeedbackEvent.kind === "success";
  const areBoardActionsLocked = sortState.status !== "active";
  const failureMessage = showFailureModal
    ? sortState.message.replace(/^Move limit reached!\s*/u, "").trim()
    : "";
  const retryLeaves = Array.from({ length: MAX_RETRY_LEAVES }, (_, index) => {
    return index < profile.retryBudgetRemaining;
  });
  const cupRows = Math.ceil(sortState.cups.length / 3);
  const boardStyle = {
    "--mm-cup-height": `max(5.4rem, min(11rem, calc((100svh - 23.5rem) / ${cupRows})))`,
  } as CSSProperties;

  return (
    <section
      className="mm-card-sheen relative overflow-hidden rounded-[30px] border border-white/72 bg-[linear-gradient(180deg,var(--mm-card-top),var(--mm-card-bottom))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_18px_40px_rgba(var(--mm-shadow-rgb),0.1)] sm:rounded-[34px] sm:p-6"
      style={boardStyle}
    >
      <div
        aria-hidden={showFailureModal}
        className={
          showFailureModal
            ? "pointer-events-none select-none opacity-35 blur-[2px]"
            : ""
        }
      >
        <header className="mb-4 sm:mb-6">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--mm-muted)]">
                Cafe Level {activeLevelIndex + 1}
              </p>
              <h1 className="mt-2 max-w-[9ch] text-[1.9rem] leading-[0.98] font-bold tracking-[-0.05em] text-[var(--mm-ink-strong)] sm:mt-3 sm:text-[2.35rem]">
                {activeLevel.name}
              </h1>
            </div>
            <div className="flex flex-col items-end gap-2 sm:gap-3">
              <div className="rounded-[20px] border border-[rgba(223,208,191,0.96)] bg-[linear-gradient(180deg,rgba(236,223,208,0.98),rgba(223,208,191,0.96))] px-4 py-3 text-center shadow-[0_12px_24px_rgba(154,133,110,0.16)] transition-transform duration-300 ease-[var(--mm-ease-spring)] hover:-translate-y-0.5 sm:rounded-[24px] sm:px-5 sm:py-4 sm:shadow-[0_16px_30px_rgba(154,133,110,0.18)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8f7966]">
                  Daily Score
                </p>
                <p
                  key={`score-${scorePulseKey}`}
                  className={`mt-1 text-[1.8rem] leading-none font-bold text-[#5b4736] sm:text-[2rem] ${
                    scorePulseKey > 0 ? "mm-score-pop" : ""
                  }`}
                >
                  {profile.dailyScore}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-[var(--mm-ink)] sm:mt-4">
            <div data-testid="moves-counter">
              <p className="text-[0.98rem] font-medium sm:text-[1.05rem]">
                Moves{" "}
                <span className="font-semibold text-[var(--mm-ink-strong)]">
                  {sortState.movesUsed} / {sortState.moveLimit}
                </span>
              </p>
            </div>
            <div
              className="flex shrink-0 items-center gap-2"
              data-testid="retry-counter"
            >
              <span className="sr-only">
                Retries Left {profile.retryBudgetRemaining}
              </span>
              {retryLeaves.map((isActive, index) => {
                const retryLeafSrc = isActive
                  ? "/icons/retry-leaf-active.svg"
                  : "/icons/retry-leaf-inactive.svg";

                return (
                  <Image
                    key={`retry-leaf-${index}`}
                    alt=""
                    aria-hidden="true"
                    className={`h-[18px] w-[18px] ${
                      isActive ? "opacity-100" : "opacity-30"
                    }`}
                    height={18}
                    src={retryLeafSrc}
                    unoptimized
                    width={18}
                  />
                );
              })}
            </div>
          </div>
        </header>

        <div
          className="grid grid-cols-3 gap-x-3 gap-y-3 sm:gap-x-6 sm:gap-y-5"
          data-testid="cups-grid"
        >
          {sortState.cups.map((cup, index) => (
            <CupStack
              key={`${index}-${cup.join("-")}-${sortFeedbackEvent.id}`}
              cup={cup}
              feedbackId={sortFeedbackEvent.id}
              index={index}
              isDeselecting={
                sortFeedbackEvent.kind === "deselect" &&
                sortFeedbackEvent.sourceIndex === index
              }
              isEmptyTap={
                sortFeedbackEvent.kind === "empty" &&
                sortFeedbackEvent.sourceIndex === index
              }
              isInvalidTarget={
                sortFeedbackEvent.kind === "invalid" &&
                sortFeedbackEvent.destinationIndex === index
              }
              isPourDestination={
                sortFeedbackEvent.kind === "success" &&
                sortFeedbackEvent.destinationIndex === index
              }
              isPourSource={
                sortFeedbackEvent.kind === "success" &&
                sortFeedbackEvent.sourceIndex === index
              }
              isSelected={sortState.selectedCupIndex === index}
              isSelectionPulse={
                sortFeedbackEvent.kind === "select" &&
                sortFeedbackEvent.sourceIndex === index
              }
              isDisabled={areBoardActionsLocked}
              onPress={() => onCupPress(index)}
            />
          ))}
        </div>

        <p
          key={`message-${sortFeedbackEvent.id}`}
          className={`mm-feedback-in mt-3 min-h-5 text-[13px] font-medium sm:mt-5 sm:min-h-6 sm:text-sm ${
            isInvalidMessage
              ? "text-[#8B6753]"
              : isSuccessMessage
                ? "text-[var(--mm-sage-deep)]"
                : "text-[var(--mm-ink)]"
          }`}
        >
          {showFailureModal ? "" : sortState.message}
        </p>
        <div className="sr-only">
          <p data-testid="undo-counter">Undo Left {sortState.undoRemaining}</p>
          <p data-testid="restart-counter">
            Restart Left {sortState.restartRemaining}
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3">
          <button
            aria-label="Undo"
            className="mm-button rounded-[16px] bg-[linear-gradient(180deg,var(--mm-sage),var(--mm-sage-deep))] px-4 py-2.5 text-sm font-semibold text-[#fffdf6] shadow-[0_12px_24px_rgba(123,141,93,0.22)] disabled:cursor-not-allowed disabled:opacity-45 sm:rounded-[18px] sm:py-3 sm:shadow-[0_16px_30px_rgba(123,141,93,0.22)]"
            disabled={
              areBoardActionsLocked ||
              sortState.history.length === 0 ||
              sortState.undoRemaining === 0
            }
            onClick={onUndo}
            type="button"
          >
            Undo ({sortState.undoRemaining})
          </button>
          <button
            aria-label="Restart"
            className="mm-button rounded-[16px] border border-[var(--mm-border)] bg-[var(--mm-surface-raised)] px-4 py-2.5 text-sm font-semibold text-[var(--mm-ink-strong)] shadow-[0_10px_20px_rgba(var(--mm-shadow-rgb),0.08)] disabled:cursor-not-allowed disabled:opacity-45 sm:rounded-[18px] sm:py-3 sm:shadow-[0_12px_24px_rgba(var(--mm-shadow-rgb),0.1)]"
            disabled={areBoardActionsLocked || sortState.restartRemaining === 0}
            onClick={onRestart}
            type="button"
          >
            Restart ({sortState.restartRemaining})
          </button>
        </div>
      </div>

      {showFailureModal ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,250,244,0.76),rgba(239,228,214,0.94))] px-4 py-5 sm:px-5 sm:py-6">
          <div
            aria-describedby="sort-failure-description"
            aria-labelledby="sort-failure-title"
            aria-modal="true"
            className="mm-card-sheen w-full max-w-[22rem] rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,var(--mm-card-top),var(--mm-card-bottom))] p-5 text-center shadow-[0_20px_48px_rgba(var(--mm-shadow-rgb),0.14)] sm:rounded-[30px] sm:p-6 sm:shadow-[0_24px_60px_rgba(var(--mm-shadow-rgb),0.16)]"
            role="dialog"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--mm-muted)]">
              Level Failed
            </p>
            <h2
              className="mt-3 text-[1.65rem] leading-[1.02] font-bold tracking-[-0.05em] text-[var(--mm-ink-strong)] sm:text-[1.85rem]"
              id="sort-failure-title"
            >
              Move limit reached
            </h2>
            <p
              className="mt-3 text-sm font-medium leading-6 text-[var(--mm-ink)]"
              id="sort-failure-description"
            >
              {failureMessage}
            </p>
            {isRetryCaptureRequired ? (
              <div className="mt-5 grid gap-2.5">
                <button
                  aria-label="Capture Matcha for +1 Retry"
                  autoFocus
                  className="mm-button w-full rounded-[16px] bg-[linear-gradient(180deg,var(--mm-sage),var(--mm-sage-deep))] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(123,141,93,0.22)] sm:rounded-[18px] sm:py-3 sm:shadow-[0_16px_30px_rgba(123,141,93,0.22)]"
                  onClick={onOpenRetryCapture}
                  type="button"
                >
                  Capture Matcha for +1 Retry
                </button>
                <button
                  aria-label="Back to Level 1"
                  className="mm-button w-full rounded-[16px] border border-[var(--mm-border)] bg-[var(--mm-surface-raised)] px-4 py-2.5 text-sm font-semibold text-[var(--mm-ink-strong)] shadow-[0_10px_20px_rgba(var(--mm-shadow-rgb),0.08)] sm:rounded-[18px] sm:py-3 sm:shadow-[0_12px_24px_rgba(var(--mm-shadow-rgb),0.1)]"
                  onClick={onResetToLevelOne}
                  type="button"
                >
                  Back to Level 1
                </button>
              </div>
            ) : (
              <button
                aria-label="Retry"
                autoFocus
                className="mm-button mt-5 w-full rounded-[16px] bg-[linear-gradient(180deg,var(--mm-sage),var(--mm-sage-deep))] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(123,141,93,0.22)] sm:rounded-[18px] sm:py-3 sm:shadow-[0_16px_30px_rgba(123,141,93,0.22)]"
                onClick={onTryAgain}
                type="button"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
