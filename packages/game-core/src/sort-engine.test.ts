import { describe, expect, it } from "vitest";
import {
  attemptPour,
  canPour,
  checkWin,
  cloneCups,
  createSortState,
  restartSortState,
  undoSortMove,
} from "./sort-engine";
import { COLORS, LEVELS } from "./catalog";

function playMoves(
  seedLevelIndex: number,
  moves: Array<[number, number]>,
  moveLimit = LEVELS[seedLevelIndex].moveLimit,
) {
  return moves.reduce(
    (state, [sourceIndex, destinationIndex]) =>
      attemptPour(state, sourceIndex, destinationIndex),
    createSortState(LEVELS[seedLevelIndex].cups, moveLimit),
  );
}

describe("sort-engine", () => {
  it("defines rebuilt levels with built-in empty cups and move limits", () => {
    expect(LEVELS.map(({ moveLimit, cups }) => ({ moveLimit, cups }))).toEqual([
      {
        moveLimit: 8,
        cups: [
          [COLORS.matcha, COLORS.milk, COLORS.matcha],
          [COLORS.milk, COLORS.strawberry, COLORS.milk],
          [],
          [],
        ],
      },
      {
        moveLimit: 10,
        cups: [
          [COLORS.matcha, COLORS.milk, COLORS.strawberry],
          [COLORS.strawberry, COLORS.matcha, COLORS.milk],
          [COLORS.milk, COLORS.strawberry, COLORS.matcha],
          [],
        ],
      },
      {
        moveLimit: 12,
        cups: [
          [COLORS.matcha, COLORS.milk, COLORS.lavender],
          [COLORS.lavender, COLORS.strawberry, COLORS.matcha],
          [COLORS.milk, COLORS.lavender, COLORS.strawberry],
          [COLORS.strawberry, COLORS.matcha, COLORS.milk],
          [],
        ],
      },
      {
        moveLimit: 12,
        cups: [
          [COLORS.matcha, COLORS.milk, COLORS.chocolate],
          [COLORS.chocolate, COLORS.strawberry, COLORS.matcha],
          [COLORS.milk, COLORS.chocolate, COLORS.strawberry],
          [COLORS.strawberry, COLORS.matcha, COLORS.milk],
          [COLORS.lavender, COLORS.lavender, COLORS.lavender],
          [],
        ],
      },
      {
        moveLimit: 15,
        cups: [
          [COLORS.strawberry, COLORS.lavender, COLORS.chocolate],
          [COLORS.strawberry, COLORS.matcha, COLORS.milk],
          [COLORS.lavender, COLORS.chocolate, COLORS.milk],
          [COLORS.matcha, COLORS.chocolate, COLORS.strawberry],
          [COLORS.lavender, COLORS.milk, COLORS.matcha],
          [],
          [],
        ],
      },
    ]);
  });

  it("pours contiguous top layers into matching destination", () => {
    const state = createSortState(
      [[COLORS.matcha, COLORS.milk, COLORS.milk], [COLORS.milk], []],
      8,
    );
    const result = attemptPour(state, 0, 1);

    expect(result.cups[0]).toEqual([COLORS.matcha]);
    expect(result.cups[1]).toEqual([COLORS.milk, COLORS.milk, COLORS.milk]);
    expect(result.message).toBe("Perfect service! Level cleared.");
    expect(result.movesUsed).toBe(1);
    expect(result.status).toBe("won");
  });

  it("blocks mismatched destination colors", () => {
    const state = createSortState([[COLORS.matcha], [COLORS.milk], []], 8);

    expect(canPour(state.cups, 0, 1)).toBe(false);
    expect(attemptPour(state, 0, 1).message).toBe(
      "Mismatched ingredients! Pour onto matching colors only.",
    );
  });

  it("blocks pours into full destination cups", () => {
    const state = createSortState(LEVELS[0].cups, LEVELS[0].moveLimit);

    expect(canPour(state.cups, 0, 1)).toBe(false);
    expect(attemptPour(state, 0, 1).message).toBe("Oops! That glass is full.");
  });

  it("wins rebuilt levels using built-in cups within move limits", () => {
    const winningPaths: Array<Array<[number, number]>> = [
      [
        [0, 2],
        [1, 0],
        [1, 3],
        [0, 1],
        [0, 2],
      ],
      [
        [0, 3],
        [1, 0],
        [2, 1],
        [2, 3],
        [0, 2],
        [1, 0],
        [1, 3],
      ],
      [
        [0, 4],
        [3, 0],
        [1, 3],
        [2, 1],
        [2, 4],
        [0, 2],
        [3, 0],
        [1, 3],
        [1, 4],
      ],
      [
        [0, 5],
        [3, 0],
        [1, 3],
        [2, 1],
        [2, 5],
        [0, 2],
        [3, 0],
        [1, 3],
        [1, 5],
      ],
      [
        [0, 5],
        [1, 6],
        [2, 6],
        [2, 5],
        [0, 2],
        [3, 0],
        [3, 5],
        [1, 3],
        [0, 1],
        [4, 3],
        [4, 6],
        [2, 4],
      ],
    ];

    winningPaths.forEach((moves, levelIndex) => {
      const result = playMoves(levelIndex, moves);

      expect(result.status).toBe("won");
      expect(result.movesUsed).toBe(moves.length);
      expect(result.movesUsed).toBeLessThanOrEqual(LEVELS[levelIndex].moveLimit);
      expect(checkWin(result.cups)).toBe(true);
    });
  });

  it("fails when last allowed move does not solve level", () => {
    const state = createSortState(LEVELS[0].cups, 1);
    const failed = attemptPour(state, 0, 2);

    expect(failed.movesUsed).toBe(1);
    expect(failed.status).toBe("failed");
    expect(failed.message).toContain("Move limit");
  });

  it("keeps win state when final allowed move solves level", () => {
    const winningMoves: Array<[number, number]> = [
      [0, 2],
      [1, 0],
      [1, 3],
      [0, 1],
      [0, 2],
    ];
    const result = playMoves(0, winningMoves, winningMoves.length);

    expect(result.movesUsed).toBe(winningMoves.length);
    expect(result.status).toBe("won");
    expect(checkWin(result.cups)).toBe(true);
  });

  it("restores previous board with undo and refunds move count", () => {
    const moved = playMoves(2, [
      [0, 4],
      [3, 0],
      [1, 3],
      [2, 1],
      [2, 4],
    ]);
    const initialCups = cloneCups(LEVELS[2].cups);

    expect(moved.history).toHaveLength(5);
    expect(moved.undoRemaining).toBe(5);

    const undoneFiveTimes = Array.from({ length: 5 }).reduce(
      (state) => undoSortMove(state),
      moved,
    );
    const blockedUndo = undoSortMove(undoneFiveTimes);

    expect(undoneFiveTimes.cups).toEqual(initialCups);
    expect(undoneFiveTimes.movesUsed).toBe(0);
    expect(undoneFiveTimes.undoRemaining).toBe(0);
    expect(blockedUndo).toEqual(undoneFiveTimes);
  });

  it("restarts with fresh moves and undo but spends restart use", () => {
    const state = createSortState(LEVELS[0].cups, LEVELS[0].moveLimit);
    const moved = attemptPour(state, 0, 2);
    const undone = undoSortMove(moved);
    const restarted = restartSortState(
      undone,
      LEVELS[0].cups,
      LEVELS[0].moveLimit,
    );
    const blockedRestart = restartSortState(
      restarted,
      LEVELS[0].cups,
      LEVELS[0].moveLimit,
    );

    expect(undone.undoRemaining).toBe(4);
    expect(restarted.cups).toEqual(state.cups);
    expect(restarted.movesUsed).toBe(0);
    expect(restarted.undoRemaining).toBe(5);
    expect(restarted.restartRemaining).toBe(0);
    expect(blockedRestart).toEqual(restarted);
  });

  it("detects solved board", () => {
    expect(
      checkWin([
        [COLORS.matcha, COLORS.matcha, COLORS.matcha],
        [COLORS.milk, COLORS.milk, COLORS.milk],
        [],
      ]),
    ).toBe(true);
  });
});
