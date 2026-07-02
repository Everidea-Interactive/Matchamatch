import { describe, expect, it } from "vitest";
import {
  attemptPour,
  canPour,
  checkWin,
  cloneCups,
  createSortState,
  undoSortMove,
  usePowerUp,
} from "./sort-engine";
import { COLORS, LEVELS } from "./catalog";

describe("sort-engine", () => {
  it("pours contiguous top layers into matching destination", () => {
    const state = createSortState([
      [COLORS.matcha, COLORS.milk, COLORS.milk],
      [COLORS.milk],
      [],
    ]);
    const result = attemptPour(state, 0, 1);

    expect(result.cups[0]).toEqual(["#76895C"]);
    expect(result.cups[1]).toEqual(["#F8F9F3", "#F8F9F3", "#F8F9F3"]);
    expect(result.message).toBe("Satisfying pour! Keep it up.");
  });

  it("blocks mismatched destination colors", () => {
    const state = createSortState([[COLORS.matcha], [COLORS.milk], []]);

    expect(canPour(state.cups, 0, 1)).toBe(false);
    expect(attemptPour(state, 0, 1).message).toBe(
      "Mismatched ingredients! Pour onto matching colors only.",
    );
  });

  it("blocks pours into full destination cups", () => {
    const state = createSortState(LEVELS[0].cups);

    expect(canPour(state.cups, 0, 1)).toBe(false);
    expect(attemptPour(state, 0, 1).message).toBe("Oops! That glass is full.");
  });

  it("supports single extra empty cup power-up", () => {
    const state = createSortState(cloneCups(LEVELS[2].cups));
    const powered = usePowerUp(state);
    const blocked = usePowerUp(powered);

    expect(powered.cups.at(-1)).toEqual([]);
    expect(powered.hasAddedCup).toBe(true);
    expect(blocked.cups).toEqual(powered.cups);
  });

  it("restores previous board with undo", () => {
    const state = createSortState(LEVELS[0].cups);
    const moved = attemptPour(state, 0, 2);
    const undone = undoSortMove(moved);

    expect(undone.cups).toEqual(state.cups);
  });

  it("detects solved board", () => {
    expect(
      checkWin([
        ["#76895C", "#76895C", "#76895C"],
        ["#F8F9F3", "#F8F9F3", "#F8F9F3"],
        [],
      ]),
    ).toBe(true);
  });
});
