import type { Cup, SortState } from "./types";

const CUP_CAPACITY = 3;
const INITIAL_MESSAGE = "Tap a cup to select, then tap another to pour.";
const MISMATCH_MESSAGE =
  "Mismatched ingredients! Pour onto matching colors only.";
const FULL_CUP_MESSAGE = "Oops! That glass is full.";
const SUCCESS_MESSAGE = "Satisfying pour! Keep it up.";
const EXTRA_CUP_MESSAGE = "Empty glass added! You now have more options.";
const UNDO_MESSAGE = "Undo applied! Keep sorting.";

export function cloneCups(cups: Cup[]): Cup[] {
  return cups.map((cup) => [...cup]);
}

export function createSortState(seedCups: Cup[]): SortState {
  return {
    cups: cloneCups(seedCups),
    selectedCupIndex: null,
    hasAddedCup: false,
    history: [],
    message: INITIAL_MESSAGE,
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

  return {
    ...state,
    cups,
    selectedCupIndex: null,
    history: [...state.history, cloneCups(state.cups)],
    message: SUCCESS_MESSAGE,
  };
}

export function usePowerUp(state: SortState): SortState {
  if (state.hasAddedCup) {
    return state;
  }

  return {
    ...state,
    cups: [...cloneCups(state.cups), []],
    hasAddedCup: true,
    history: [...state.history, cloneCups(state.cups)],
    message: EXTRA_CUP_MESSAGE,
  };
}

export function undoSortMove(state: SortState): SortState {
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
