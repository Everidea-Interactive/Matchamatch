import type { CSSProperties } from "react";

export function CupStack({
  cup,
  feedbackId,
  index,
  isDeselecting,
  isDisabled,
  isEmptyTap,
  isInvalidTarget,
  isPourDestination,
  isPourSource,
  isSelected,
  isSelectionPulse,
  onPress,
}: {
  cup: string[];
  feedbackId: number;
  index: number;
  isDeselecting: boolean;
  isDisabled: boolean;
  isEmptyTap: boolean;
  isInvalidTarget: boolean;
  isPourDestination: boolean;
  isPourSource: boolean;
  isSelected: boolean;
  isSelectionPulse: boolean;
  onPress: () => void;
}) {
  const shouldShake = isEmptyTap || isInvalidTarget;
  const shouldPulse = isSelectionPulse || isDeselecting;
  const animationClassName = [
    shouldShake ? "mm-cup-shake" : "",
    shouldPulse ? "mm-cup-select-pop" : "",
    isPourSource ? "mm-cup-pour-source" : "",
    isPourDestination ? "mm-cup-pour-destination" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      aria-label={`Cup ${index + 1}`}
      aria-pressed={isSelected}
      className={
        isSelected
          ? `mm-cup ${animationClassName} flex h-[var(--mm-cup-height)] flex-col-reverse overflow-hidden rounded-[28px] border border-[#d7d8ca] bg-white/88 shadow-[0_18px_28px_rgba(177,182,151,0.18)] ring-3 ring-[#d8e2bf]/85 sm:shadow-[0_22px_36px_rgba(177,182,151,0.18)] sm:ring-4`
          : `mm-cup ${animationClassName} flex h-[var(--mm-cup-height)] flex-col-reverse overflow-hidden rounded-[28px] border border-[#dcdccc] bg-white/72 shadow-[0_14px_24px_rgba(177,182,151,0.13)] hover:-translate-y-0.5 hover:shadow-[0_18px_28px_rgba(177,182,151,0.18)] sm:shadow-[0_18px_32px_rgba(177,182,151,0.13)] sm:hover:shadow-[0_22px_36px_rgba(177,182,151,0.18)]`
      }
      data-testid={`cup-${index}`}
      disabled={isDisabled}
      onClick={onPress}
      type="button"
    >
      {isPourSource ? (
        <span
          key={`source-wave-${feedbackId}`}
          aria-hidden="true"
          className="mm-cup-wave mm-cup-wave-source"
        />
      ) : null}
      {isPourDestination ? (
        <span
          key={`destination-wave-${feedbackId}`}
          aria-hidden="true"
          className="mm-cup-wave mm-cup-wave-destination"
        />
      ) : null}
      {cup.length === 0 ? (
        <span className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.32em] text-[#b0af98]">
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
