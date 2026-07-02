import type {
  LevelDefinition,
  LocalProfile,
  SortState,
} from "@matchamatch/game-core";
import { canPour } from "@matchamatch/game-core";
import { useMemo } from "react";
import type { SortFeedbackEvent } from "@/hooks/use-matchamatch-app";
import { CupStack } from "./cup-stack";
import { RetryLeafIcon } from "./retry-leaf-icon";

const MAX_RETRY_LEAVES = 3;

export function SortBoard({
  activeLevel,
  activeLevelIndex,
  onCupPress,
  onRestart,
  onTryAgain,
  onUndo,
  profile,
  scorePulseKey,
  sortState,
  sortFeedbackEvent,
}: {
  activeLevel: LevelDefinition;
  activeLevelIndex: number;
  onCupPress: (index: number) => void;
  onRestart: () => void;
  onTryAgain: () => void;
  onUndo: () => void;
  profile: LocalProfile;
  scorePulseKey: number;
  sortState: SortState;
  sortFeedbackEvent: SortFeedbackEvent;
}) {
  const showFailureModal = sortState.status === "failed";
  const candidateTargets = useMemo(() => {
    const selectedCupIndex = sortState.selectedCupIndex;

    if (selectedCupIndex === null) {
      return new Set<number>();
    }

    return new Set(
      sortState.cups
        .map((_, index) => index)
        .filter((index) => canPour(sortState.cups, selectedCupIndex, index)),
    );
  }, [sortState.cups, sortState.selectedCupIndex]);

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

  return (
    <section className="mm-card-sheen relative overflow-hidden rounded-[34px] bg-[linear-gradient(180deg,rgba(252,252,248,0.98),rgba(242,247,235,0.92))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] sm:p-6">
      <div
        aria-hidden={showFailureModal}
        className={
          showFailureModal
            ? "pointer-events-none select-none opacity-35 blur-[2px]"
            : ""
        }
      >
        <header className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#9A9A80]">
                Cafe Level {activeLevelIndex + 1}
              </p>
              <h1 className="mt-3 max-w-[9ch] text-[2.15rem] leading-[0.98] font-bold tracking-[-0.05em] text-[#343328] sm:text-[2.35rem]">
                {activeLevel.name}
              </h1>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="rounded-[24px] bg-white/88 px-5 py-4 text-center shadow-[0_16px_30px_rgba(144,149,120,0.14)] transition-transform duration-300 ease-[var(--mm-ease-spring)] hover:-translate-y-0.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#A0A184]">
                  Daily Score
                </p>
                <p
                  key={`score-${scorePulseKey}`}
                  className={`mt-1 text-[2rem] leading-none font-bold text-[#343328] ${
                    scorePulseKey > 0 ? "mm-score-pop" : ""
                  }`}
                >
                  {profile.dailyScore}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 text-[#66664F]">
            <div data-testid="moves-counter">
              <p className="text-[1.05rem] font-medium">
                Moves{" "}
                <span className="font-semibold text-[#2E3625]">
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
              {retryLeaves.map((isActive, index) => (
                <RetryLeafIcon key={`retry-leaf-${index}`} isActive={isActive} />
              ))}
            </div>
          </div>
        </header>

        <div
          className="grid grid-cols-3 gap-x-5 gap-y-4 sm:gap-x-6 sm:gap-y-5"
          data-testid="cups-grid"
        >
          {sortState.cups.map((cup, index) => (
            <CupStack
              key={`${index}-${cup.join("-")}-${sortFeedbackEvent.id}`}
              cup={cup}
              feedbackId={sortFeedbackEvent.id}
              index={index}
              isCandidateTarget={candidateTargets.has(index)}
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
          className={`mm-feedback-in mt-5 min-h-6 text-sm font-medium ${
            isInvalidMessage
              ? "text-[#815E4A]"
              : isSuccessMessage
                ? "text-[#44603E]"
                : "text-[#4C5A3F]"
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
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            aria-label="Undo"
            className="mm-button rounded-[18px] bg-[#7b8d5d] px-4 py-3 text-sm font-semibold text-[#fffdf6] shadow-[0_16px_30px_rgba(123,141,93,0.22)] disabled:cursor-not-allowed disabled:opacity-45"
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
            className="mm-button rounded-[18px] border border-[#e7e3d8] bg-white px-4 py-3 text-sm font-semibold text-[#3A432E] shadow-[0_12px_24px_rgba(180,184,162,0.12)] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={areBoardActionsLocked || sortState.restartRemaining === 0}
            onClick={onRestart}
            type="button"
          >
            Restart ({sortState.restartRemaining})
          </button>
        </div>
      </div>

      {showFailureModal ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),rgba(232,238,220,0.94))] px-5 py-6">
          <div
            aria-describedby="sort-failure-description"
            aria-labelledby="sort-failure-title"
            aria-modal="true"
            className="mm-card-sheen w-full max-w-[22rem] rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(252,252,248,0.99),rgba(242,247,235,0.97))] p-6 text-center shadow-[0_24px_60px_rgba(126,138,101,0.24)]"
            role="dialog"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9A9A80]">
              Level Failed
            </p>
            <h2
              className="mt-3 text-[1.85rem] leading-[1.02] font-bold tracking-[-0.05em] text-[#343328]"
              id="sort-failure-title"
            >
              Move limit reached
            </h2>
            <p
              className="mt-3 text-sm font-medium leading-6 text-[#66664F]"
              id="sort-failure-description"
            >
              {failureMessage}
            </p>
            <button
              aria-label="Retry"
              autoFocus
              className="mm-button mt-5 w-full rounded-[18px] bg-[#7b8d5d] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(123,141,93,0.22)]"
              onClick={onTryAgain}
              type="button"
            >
              Retry
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
