"use client";

import type { SkinId } from "@matchamatch/game-core";
import { useEffect, useRef, useState } from "react";
import {
  INITIAL_SORT_MESSAGE,
  LEVELS,
  SKINS,
  applyCaptureReward,
  applyFailurePenalty,
  applyLevelReward,
  attemptPour,
  canPour,
  createSortState,
  loadProfile,
  restartSortState,
  saveProfile,
  undoSortMove,
  type MatchaDetection,
  type LocalProfile,
  type SortState,
} from "@matchamatch/game-core";

export type SortFeedbackKind =
  | "idle"
  | "select"
  | "deselect"
  | "empty"
  | "invalid"
  | "success"
  | "undo";

export interface SortFeedbackEvent {
  id: number;
  kind: SortFeedbackKind;
  sourceIndex: number | null;
  destinationIndex: number | null;
}

export function useMatchamatchApp() {
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [currentBoardLevelIndex, setCurrentBoardLevelIndex] = useState(0);
  const [sortState, setSortState] = useState<SortState | null>(null);
  const [activeTab, setActiveTabState] = useState<"sort" | "go">("sort");
  const [scannerFeedback, setScannerFeedback] = useState(
    "Point camera at Matcha or upload a drink photo.",
  );
  const [scannerFeedbackKey, setScannerFeedbackKey] = useState(0);
  const [scorePulseKey, setScorePulseKey] = useState(0);
  const [recentUnlockedSkinIds, setRecentUnlockedSkinIds] = useState<SkinId[]>(
    [],
  );
  const [sortFeedbackEvent, setSortFeedbackEvent] = useState<SortFeedbackEvent>({
    id: 0,
    kind: "idle",
    sourceIndex: null,
    destinationIndex: null,
  });
  const [isAdvancingLevel, setIsAdvancingLevel] = useState(false);
  const levelAdvanceTimeoutRef = useRef<number | null>(null);

  function createLevelState(levelIndex: number) {
    const level = LEVELS[levelIndex] ?? LEVELS[0];
    return createSortState(level.cups, level.moveLimit);
  }

  function getFailureMessage(
    failedProfile: LocalProfile,
    didResetToLevelOne: boolean,
  ) {
    if (didResetToLevelOne) {
      return "Move limit reached! Retry budget refilled. Tap Try Again for Cafe Level 1.";
    }

    return `Move limit reached! ${failedProfile.retryBudgetRemaining} retries left. Tap Try Again.`;
  }

  function emitSortFeedback(
    kind: SortFeedbackKind,
    sourceIndex: number | null = null,
    destinationIndex: number | null = null,
  ) {
    setSortFeedbackEvent((current) => ({
      id: current.id + 1,
      kind,
      sourceIndex,
      destinationIndex,
    }));
  }

  function resetSortFeedback() {
    setSortFeedbackEvent((current) => ({
      id: current.id + 1,
      kind: "idle",
      sourceIndex: null,
      destinationIndex: null,
    }));
  }

  function clearTransientSortUi() {
    setSortFeedbackEvent((current) =>
      current.kind === "idle" &&
      current.sourceIndex === null &&
      current.destinationIndex === null
        ? current
        : {
            ...current,
            kind: "idle",
            sourceIndex: null,
            destinationIndex: null,
          },
    );

    setSortState((current) => {
      if (!current || current.selectedCupIndex === null) {
        return current;
      }

      return {
        ...current,
        selectedCupIndex: null,
        message: INITIAL_SORT_MESSAGE,
      };
    });
  }

  function setActiveTab(tab: "sort" | "go") {
    if (tab === activeTab) {
      return;
    }

    clearTransientSortUi();
    setActiveTabState(tab);
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const nextProfile = loadProfile(window.localStorage);
    setProfile(nextProfile);
    setCurrentBoardLevelIndex(nextProfile.currentLevelIndex);
    setSortState(createLevelState(nextProfile.currentLevelIndex));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!profile) {
      return;
    }

    saveProfile(window.localStorage, profile);
  }, [profile]);

  useEffect(() => {
    if (recentUnlockedSkinIds.length === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRecentUnlockedSkinIds([]);
    }, 1600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [recentUnlockedSkinIds]);

  useEffect(() => {
    return () => {
      if (levelAdvanceTimeoutRef.current !== null) {
        window.clearTimeout(levelAdvanceTimeoutRef.current);
      }
    };
  }, []);

  const activeLevel = profile
    ? (LEVELS[currentBoardLevelIndex] ?? LEVELS[0])
    : null;

  function restartLevel() {
    if (
      !profile ||
      !sortState ||
      isAdvancingLevel ||
      sortState.restartRemaining === 0 ||
      sortState.status !== "active"
    ) {
      return;
    }

    resetSortFeedback();
    setSortState(
      restartSortState(
        sortState,
        (LEVELS[currentBoardLevelIndex] ?? LEVELS[0]).cups,
        (LEVELS[currentBoardLevelIndex] ?? LEVELS[0]).moveLimit,
      ),
    );
  }

  function undoMove() {
    if (
      !sortState ||
      isAdvancingLevel ||
      sortState.history.length === 0 ||
      sortState.undoRemaining === 0 ||
      sortState.status !== "active"
    ) {
      return;
    }

    emitSortFeedback("undo");
    setSortState(undoSortMove(sortState));
  }

  function onCupPress(index: number) {
    if (!sortState || isAdvancingLevel || sortState.status !== "active") {
      return;
    }

    if (sortState.selectedCupIndex === null) {
      if (sortState.cups[index]?.length) {
        emitSortFeedback("select", index);
        setSortState({
          ...sortState,
          selectedCupIndex: index,
          message: "Glass selected. Tap another glass to pour.",
        });
        return;
      }

      emitSortFeedback("empty", index);
      setSortState({
        ...sortState,
        message: "That glass is empty. Choose another glass!",
      });
      return;
    }

    if (sortState.selectedCupIndex === index) {
      emitSortFeedback("deselect", index);
      setSortState({
        ...sortState,
        selectedCupIndex: null,
        message: "Deselected glass. Select a cup to start.",
      });
      return;
    }

    const sourceIndex = sortState.selectedCupIndex;
    const isValidPour = canPour(sortState.cups, sourceIndex, index);
    const nextState = attemptPour(sortState, sourceIndex, index);

    if (!isValidPour) {
      emitSortFeedback("invalid", sourceIndex, index);
      setSortState(nextState);
      return;
    }

    if (nextState.status === "won" && profile) {
      emitSortFeedback("success", sourceIndex, index);
      setSortState(nextState);
      setIsAdvancingLevel(true);

      const nextProfile = applyLevelReward(profile);
      levelAdvanceTimeoutRef.current = window.setTimeout(() => {
        setProfile(nextProfile);
        setCurrentBoardLevelIndex(nextProfile.currentLevelIndex);
        resetSortFeedback();
        setSortState(createLevelState(nextProfile.currentLevelIndex));
        setScorePulseKey((current) => current + 1);
        setIsAdvancingLevel(false);
        levelAdvanceTimeoutRef.current = null;
      }, 260);

      return;
    }

    if (nextState.status === "failed" && profile) {
      const nextProfile = applyFailurePenalty(profile);
      const didResetToLevelOne = profile.retryBudgetRemaining === 1;

      emitSortFeedback("success", sourceIndex, index);
      setProfile(nextProfile);
      setSortState({
        ...nextState,
        message: getFailureMessage(nextProfile, didResetToLevelOne),
      });
      return;
    }

    emitSortFeedback("success", sourceIndex, index);
    setSortState(nextState);
  }

  function tryAgain() {
    if (!profile || !sortState || sortState.status !== "failed") {
      return;
    }

    setCurrentBoardLevelIndex(profile.currentLevelIndex);
    resetSortFeedback();
    setSortState(createLevelState(profile.currentLevelIndex));
  }

  function applyScannerResult(result: MatchaDetection) {
    setProfile((current) => {
      if (!current) {
        return current;
      }

      const nextProfile = applyCaptureReward(current, result.isMatcha);
      const unlockedSkins = SKINS.filter(
        (skin) =>
          !current.unlockedSkins.includes(skin.id) &&
          nextProfile.unlockedSkins.includes(skin.id),
      );
      const unlockedNames = unlockedSkins.map(
        (skin) => `${skin.name} ${skin.emoji}`,
      );

      let alertMessage = result.isMatcha
        ? "Real green Matcha segmented! Restored +100 Pts."
        : "Daily cup segment restored! +100 Pts.";

      if (unlockedNames.length > 0) {
        alertMessage += ` Unlocked ${unlockedNames.join(" & ")} skin!`;
      }

      setRecentUnlockedSkinIds(unlockedSkins.map((skin) => skin.id));
      setScannerFeedback(alertMessage);
      setScannerFeedbackKey((value) => value + 1);
      setScorePulseKey((value) => value + 1);
      saveProfile(window.localStorage, nextProfile);
      return nextProfile;
    });
  }

  return {
    activeLevel,
    activeTab,
    applyScannerResult,
    currentBoardLevelIndex,
    onCupPress,
    profile,
    recentUnlockedSkinIds,
    restartLevel,
    scannerFeedbackKey,
    scannerFeedback,
    setActiveTab,
    setProfile,
    setSortState,
    scorePulseKey,
    sortState,
    sortFeedbackEvent,
    tryAgain,
    undoMove,
    advanceLevel: () =>
      setProfile((current) => (current ? applyLevelReward(current) : current)),
  };
}
