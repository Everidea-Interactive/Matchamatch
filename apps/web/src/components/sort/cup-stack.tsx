import type { CSSProperties } from "react";

const CUP_VIEWBOX_WIDTH = 187.21;
const CUP_VIEWBOX_HEIGHT = 313.23;
const CUP_OUTER_PATH =
  "M183.71,3.5v273a33.19,33.19,0,0,1-33.19,33.2H36.7a33.19,33.19,0,0,1-33.2-33.2V3.5";
const CUP_OUTER_PATH_CLOSED = `${CUP_OUTER_PATH}Z`;
const CUP_INNER_PATH =
  "M183.71,3.5V264.3c0,15.39-13.2,27.87-29.5,27.87H33c-16.29,0-29.5-12.48-29.5-27.87V3.5";
const CUP_INNER_PATH_CLOSED = `${CUP_INNER_PATH}Z`;
const LIQUID_TOP = 17.45;
const LIQUID_BOTTOM = 292.17;
const LIQUID_HEIGHT = LIQUID_BOTTOM - LIQUID_TOP;
const LAYER_HEIGHT = LIQUID_HEIGHT / 3;

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
  const clipPathId = `cup-liquid-clip-${index}`;
  const depthGradientId = `cup-depth-gradient-${index}`;
  const surfaceGradientId = `cup-surface-gradient-${index}`;
  const glassGradientId = `cup-glass-gradient-${index}`;
  const glassHighlightId = `cup-glass-highlight-${index}`;
  const glassSideHighlightId = `cup-glass-side-highlight-${index}`;
  const bottomLayerTop = LIQUID_BOTTOM - LAYER_HEIGHT;
  const bottomLayerPath = `M183.71,${bottomLayerTop}V264.3c0,15.39-13.2,27.87-29.5,27.87H33c-16.29,0-29.5-12.48-29.5-27.87V${bottomLayerTop}Z`;

  return (
    <button
      aria-label={`Cup ${index + 1}`}
      aria-pressed={isSelected}
      data-selected={isSelected ? "true" : "false"}
      className={
        isSelected
          ? `mm-cup ${animationClassName} block h-[var(--mm-cup-height)] w-full rounded-[30px] bg-transparent p-0 shadow-[0_18px_28px_rgba(177,182,151,0.18)] focus-visible:outline-none sm:shadow-[0_22px_36px_rgba(177,182,151,0.18)]`
          : `mm-cup ${animationClassName} block h-[var(--mm-cup-height)] w-full rounded-[30px] bg-transparent p-0 shadow-[0_14px_24px_rgba(177,182,151,0.13)] hover:-translate-y-0.5 hover:shadow-[0_18px_28px_rgba(177,182,151,0.18)] focus-visible:outline-none sm:shadow-[0_18px_32px_rgba(177,182,151,0.13)] sm:hover:shadow-[0_22px_36px_rgba(177,182,151,0.18)]`
      }
      data-testid={`cup-${index}`}
      disabled={isDisabled}
      onClick={onPress}
      type="button"
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none block h-full w-full overflow-visible"
        viewBox={`0 0 ${CUP_VIEWBOX_WIDTH} ${CUP_VIEWBOX_HEIGHT}`}
      >
        <defs>
          <clipPath id={clipPathId}>
            <path d={CUP_OUTER_PATH_CLOSED} />
          </clipPath>
          <linearGradient
            id={depthGradientId}
            x1="93.6"
            x2="93.6"
            y1={LIQUID_TOP}
            y2={LIQUID_BOTTOM}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="0.2" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.82" stopColor="#483b2e" stopOpacity="0" />
            <stop offset="1" stopColor="#483b2e" stopOpacity="0.16" />
          </linearGradient>
          <linearGradient
            id={surfaceGradientId}
            x1="0"
            x2={CUP_VIEWBOX_WIDTH}
            y1="0"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.32" />
            <stop offset="0.16" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="0.84" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#483b2e" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient
            id={glassGradientId}
            x1="-19.1"
            x2="405.69"
            y1="117.99"
            y2="218.93"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#564637" stopOpacity="0" />
            <stop offset="1" stopColor="#564637" stopOpacity="1" />
          </linearGradient>
          <linearGradient
            id={glassHighlightId}
            x1="67.52"
            x2="67.52"
            y1="246.04"
            y2="49.57"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
          <linearGradient
            id={glassSideHighlightId}
            x1="39.75"
            x2="39.75"
            y1="246.04"
            y2="49.57"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
        </defs>

        {isSelected ? (
          <path className="mm-cup-selection-glow" d={CUP_OUTER_PATH} />
        ) : null}
        {isPourSource ? (
          <path
            key={`source-wave-${feedbackId}`}
            className="mm-cup-wave-path mm-cup-wave-source"
            d={CUP_INNER_PATH}
          />
        ) : null}
        {isPourDestination ? (
          <path
            key={`destination-wave-${feedbackId}`}
            className="mm-cup-wave-path mm-cup-wave-destination"
            d={CUP_INNER_PATH}
          />
        ) : null}

        <g clipPath={`url(#${clipPathId})`}>
          <rect
            x="0"
            y={LIQUID_TOP}
            width={CUP_VIEWBOX_WIDTH}
            height={LIQUID_HEIGHT}
            fill="#f6f5ef"
            opacity="0.42"
          />
          {cup.map((color, layerIndex) => (
            layerIndex === 0 ? (
              <path
                key={`${index}-${layerIndex}-${color}`}
                className="mm-cup-layer"
                d={bottomLayerPath}
                fill={color}
                style={
                  {
                    "--mm-layer-delay": `${layerIndex * 40}ms`,
                  } as CSSProperties
                }
              />
            ) : (
              <rect
                key={`${index}-${layerIndex}-${color}`}
                className="mm-cup-layer"
                x="0"
                y={LIQUID_BOTTOM - (layerIndex + 1) * LAYER_HEIGHT}
                width={CUP_VIEWBOX_WIDTH}
                height={LAYER_HEIGHT + 1}
                fill={color}
                style={
                  {
                    "--mm-layer-delay": `${layerIndex * 40}ms`,
                  } as CSSProperties
                }
              />
            )
          ))}
          <rect
            x="0"
            y={LIQUID_TOP}
            width={CUP_VIEWBOX_WIDTH}
            height={LIQUID_HEIGHT}
            fill={`url(#${depthGradientId})`}
          />
          <rect
            x="0"
            y={LIQUID_TOP}
            width={CUP_VIEWBOX_WIDTH}
            height={LIQUID_HEIGHT}
            fill={`url(#${surfaceGradientId})`}
          />
        </g>

        {cup.length === 0 ? (
          <text
            x="93.6"
            y="183"
            className="mm-cup-empty-label"
            textAnchor="middle"
          >
            Empty
          </text>
        ) : null}

        <path className="mm-cup-frame-stroke" d={CUP_OUTER_PATH} />
        <path className="mm-cup-frame-stroke" d={CUP_INNER_PATH} />
        <path
          d={CUP_INNER_PATH_CLOSED}
          fill={`url(#${glassGradientId})`}
          opacity="0.5"
        />
        <rect
          x="61.76"
          y="17.45"
          width="11.52"
          height="260.78"
          fill={`url(#${glassHighlightId})`}
        />
        <path
          d="M37.07,278.22H53.63V17.45H25.86V276.34A33.89,33.89,0,0,0,37.07,278.22Z"
          fill={`url(#${glassSideHighlightId})`}
        />
      </svg>
    </button>
  );
}
