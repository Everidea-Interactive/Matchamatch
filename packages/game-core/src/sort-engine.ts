import type { Cup, SortState } from "./types";

const CUP_CAPACITY = 3;
export const DEFAULT_RESTART_LIMIT = 1;
export const DEFAULT_UNDO_LIMIT = 5;
export const INITIAL_SORT_MESSAGE = "Tap a cup to select, then tap another to pour.";
const MISMATCH_MESSAGE =
  "Mismatched ingredients! Pour onto matching colors only.";
const FULL_CUP_MESSAGE = "Oops! That glass is full.";
const MOVE_LIMIT_MESSAGE = "Move limit reached! Level failed.";
const SUCCESS_MESSAGE = "Satisfying pour! Keep it up.";
const WIN_MESSAGE = "Perfect service! Level cleared.";
const UNDO_MESSAGE = "Undo applied! Keep sorting.";

export function cloneCups(cups: Cup[]): Cup[] {
  return cups.map((cup) => [...cup]);
}

export function createSortState(seedCups: Cup[], moveLimit: number): SortState {
  return {
    cups: cloneCups(seedCups),
    selectedCupIndex: null,
    history: [],
    message: INITIAL_SORT_MESSAGE,
    moveLimit,
    movesUsed: 0,
    restartRemaining: DEFAULT_RESTART_LIMIT,
    status: "active",
    undoRemaining: DEFAULT_UNDO_LIMIT,
  };
}

export function canPour(
  cups: Cup[],
  sourceIndex: number,
  destinationIndex: number,
): boolean {
  const source = cups[sourceIndex];
  const destination = cups[destinationIndex];

  if (!source?.length || !destination || sourceIndex === destinationIndex) {
    return false;
  }

  if (destination.length >= CUP_CAPACITY) {
    return false;
  }

  const topColor = source.at(-1);
  const destinationTopColor = destination.at(-1);

  return destinationTopColor === undefined || destinationTopColor === topColor;
}

function getInvalidPourMessage(
  cups: Cup[],
  sourceIndex: number,
  destinationIndex: number,
): string {
  const source = cups[sourceIndex];
  const destination = cups[destinationIndex];

  if (!source?.length || !destination || sourceIndex === destinationIndex) {
    return MISMATCH_MESSAGE;
  }

  if (destination.length >= CUP_CAPACITY) {
    return FULL_CUP_MESSAGE;
  }

  return MISMATCH_MESSAGE;
}

export function attemptPour(
  state: SortState,
  sourceIndex: number,
  destinationIndex: number,
): SortState {
  if (state.status !== "active") {
    return state;
  }

  if (!canPour(state.cups, sourceIndex, destinationIndex)) {
    return {
      ...state,
      selectedCupIndex: null,
      message: getInvalidPourMessage(
        state.cups,
        sourceIndex,
        destinationIndex,
      ),
    };
  }

  const cups = cloneCups(state.cups);
  const source = cups[sourceIndex];
  const destination = cups[destinationIndex];
  const topColor = source.at(-1);

  if (!topColor) {
    return {
      ...state,
      selectedCupIndex: null,
      message: MISMATCH_MESSAGE,
    };
  }

  let layersToPour = 0;

  for (let index = source.length - 1; index >= 0; index -= 1) {
    const canMoveLayer =
      source[index] === topColor &&
      destination.length + layersToPour < CUP_CAPACITY;

    if (!canMoveLayer) {
      break;
    }

    layersToPour += 1;
  }

  for (let index = 0; index < layersToPour; index += 1) {
    source.pop();
    destination.push(topColor);
  }

  const movesUsed = state.movesUsed + 1;
  const hasWon = checkWin(cups);
  const hasFailed = !hasWon && movesUsed >= state.moveLimit;

  return {
    ...state,
    cups,
    selectedCupIndex: null,
    history: [...state.history, cloneCups(state.cups)],
    message: hasWon
      ? WIN_MESSAGE
      : hasFailed
        ? MOVE_LIMIT_MESSAGE
        : SUCCESS_MESSAGE,
    movesUsed,
    status: hasWon ? "won" : hasFailed ? "failed" : "active",
  };
}

export function restartSortState(
  state: SortState,
  seedCups: Cup[],
  moveLimit: number,
): SortState {
  if (state.status !== "active" || state.restartRemaining === 0) {
    return state;
  }

  return {
    ...createSortState(seedCups, moveLimit),
    restartRemaining: state.restartRemaining - 1,
  };
}

export function undoSortMove(state: SortState): SortState {
  if (state.status !== "active" || state.undoRemaining === 0) {
    return state;
  }

  const previous = state.history.at(-1);

  if (!previous) {
    return state;
  }

  return {
    ...state,
    cups: cloneCups(previous),
    selectedCupIndex: null,
    history: state.history.slice(0, -1),
    message: UNDO_MESSAGE,
    movesUsed: Math.max(state.movesUsed - 1, 0),
    undoRemaining: state.undoRemaining - 1,
  };
}

export function checkWin(cups: Cup[]): boolean {
  const colorToCup = new Map<string, number>();

  for (const [index, cup] of cups.entries()) {
    if (cup.length === 0) {
      continue;
    }

    if (!cup.every((color) => color === cup[0])) {
      return false;
    }

    if (colorToCup.has(cup[0])) {
      return false;
    }

    colorToCup.set(cup[0], index);
  }

  return true;
}
