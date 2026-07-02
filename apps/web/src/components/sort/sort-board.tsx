import type {
  LevelDefinition,
  LocalProfile,
  SortState,
} from "@matchamatch/game-core";
import { canPour } from "@matchamatch/game-core";
import { useMemo } from "react";
import type { SortFeedbackEvent } from "@/hooks/use-matchamatch-app";
import { CupStack } from "./cup-stack";

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
  const isFailedMessage = sortState.status === "failed";
  const areBoardActionsLocked = sortState.status !== "active";

  return (
    <section className="mm-card-sheen rounded-[28px] bg-[linear-gradient(180deg,rgba(250,252,246,0.96),rgba(238,245,230,0.88))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
      <header className="mb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7A986E]">
              Cafe Level {activeLevelIndex + 1}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#2E3625]">
              {activeLevel.name}
            </h1>
            <p className="mt-2 text-sm font-medium text-[#5D6B4A]">
              {activeLevel.recipe}
            </p>
          </div>
          <div className="rounded-2xl bg-white/75 px-4 py-3 text-right shadow-sm transition-transform duration-300 ease-[var(--mm-ease-spring)] hover:-translate-y-0.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8AA07D]">
              Daily Score
            </p>
            <p
              key={`score-${scorePulseKey}`}
              className={`mt-1 text-2xl font-bold text-[#3A432E] ${
                scorePulseKey > 0 ? "mm-score-pop" : ""
              }`}
            >
              {profile.dailyScore}
            </p>
          </div>
        </div>
      </header>

      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div
          className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm"
          data-testid="moves-counter"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8AA07D]">
            Moves
          </p>
          <p className="mt-1 text-sm font-bold text-[#2E3625]">
            {sortState.movesUsed} / {sortState.moveLimit}
          </p>
        </div>
        <div
          className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm"
          data-testid="undo-counter"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8AA07D]">
            Undo Left
          </p>
          <p className="mt-1 text-sm font-bold text-[#2E3625]">
            {sortState.undoRemaining}
          </p>
        </div>
        <div
          className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm"
          data-testid="restart-counter"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8AA07D]">
            Restart Left
          </p>
          <p className="mt-1 text-sm font-bold text-[#2E3625]">
            {sortState.restartRemaining}
          </p>
        </div>
        <div
          className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm"
          data-testid="retry-counter"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8AA07D]">
            Retries Left
          </p>
          <p className="mt-1 text-sm font-bold text-[#2E3625]">
            {profile.retryBudgetRemaining}
          </p>
        </div>
      </div>

      <div
        className="grid gap-4"
        data-testid="cups-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))",
        }}
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
        className={`mm-feedback-in mt-4 min-h-6 text-sm font-medium ${
          isFailedMessage
            ? "text-[#7C3E27]"
            : isInvalidMessage
            ? "text-[#815E4A]"
            : isSuccessMessage
              ? "text-[#44603E]"
              : "text-[#4C5A3F]"
        }`}
      >
        {sortState.message}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          aria-label="Undo"
          className="mm-button rounded-xl bg-[#3A432E] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(58,67,46,0.18)] disabled:cursor-not-allowed disabled:opacity-30"
          disabled={
            areBoardActionsLocked ||
            sortState.history.length === 0 ||
            sortState.undoRemaining === 0
          }
          onClick={onUndo}
          type="button"
        >
          Undo
        </button>
        <button
          aria-label="Restart"
          className="mm-button rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#3A432E] shadow-sm"
          disabled={areBoardActionsLocked || sortState.restartRemaining === 0}
          onClick={onRestart}
          type="button"
        >
          Restart
        </button>
        {sortState.status === "failed" ? (
          <button
            aria-label="Try Again"
            className="mm-button rounded-xl bg-[#76895C] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(118,137,92,0.18)]"
            onClick={onTryAgain}
            type="button"
          >
            Try Again
          </button>
        ) : null}
      </div>
    </section>
  );
}
