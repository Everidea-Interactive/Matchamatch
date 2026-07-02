import type { CSSProperties } from "react";

export function CupStack({
  cup,
  feedbackId,
  index,
  isCandidateTarget,
  isDeselecting,
  isEmptyTap,
  isInvalidTarget,
  isPowerUpTarget,
  isPourDestination,
  isPourSource,
  isSelected,
  isSelectionPulse,
  onPress,
}: {
  cup: string[];
  feedbackId: number;
  index: number;
  isCandidateTarget: boolean;
  isDeselecting: boolean;
  isEmptyTap: boolean;
  isInvalidTarget: boolean;
  isPowerUpTarget: boolean;
  isPourDestination: boolean;
  isPourSource: boolean;
  isSelected: boolean;
  isSelectionPulse: boolean;
  onPress: () => void;
}) {
  const shouldShake = isEmptyTap || isInvalidTarget;
  const shouldPulse = isSelectionPulse || isDeselecting;
  const animationClassName = [
    isCandidateTarget ? "mm-cup-candidate" : "",
    shouldShake ? "mm-cup-shake" : "",
    shouldPulse ? "mm-cup-select-pop" : "",
    isPourSource ? "mm-cup-pour-source" : "",
    isPourDestination || isPowerUpTarget ? "mm-cup-pour-destination" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      aria-label={`Cup ${index + 1}`}
      aria-pressed={isSelected}
      className={
        isSelected
          ? `mm-cup ${animationClassName} flex h-40 flex-col-reverse overflow-hidden rounded-[28px] border-2 border-[#3A432E] bg-white/75 shadow-[0_20px_40px_rgba(58,67,46,0.14)] ring-4 ring-[#C6D6B8]/80`
          : `mm-cup ${animationClassName} flex h-40 flex-col-reverse overflow-hidden rounded-[28px] border-2 border-[#3A432E]/15 bg-white/55 shadow-[0_16px_32px_rgba(58,67,46,0.10)] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(58,67,46,0.14)]`
      }
      data-testid={`cup-${index}`}
      onClick={onPress}
      type="button"
    >
      <span
        aria-hidden="true"
        className="mm-cup-sheen pointer-events-none absolute inset-0 opacity-0"
      />
      {isPourSource ? (
        <span
          key={`source-wave-${feedbackId}`}
          aria-hidden="true"
          className="mm-cup-wave mm-cup-wave-source"
        />
      ) : null}
      {isPourDestination || isPowerUpTarget ? (
        <span
          key={`destination-wave-${feedbackId}`}
          aria-hidden="true"
          className="mm-cup-wave mm-cup-wave-destination"
        />
      ) : null}
      {cup.length === 0 ? (
        <span className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.3em] text-[#9AAC8D]">
          Empty
        </span>
      ) : null}
      {cup.map((color, layerIndex) => (
        <span
          key={`${index}-${layerIndex}-${color}`}
          className="mm-cup-layer block h-1/3 w-full"
          style={{
            "--mm-layer-delay": `${layerIndex * 40}ms`,
            backgroundColor: color,
          } as CSSProperties}
        />
      ))}
    </button>
  );
}
