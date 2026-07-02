"use client";

import type { SkinId } from "@matchamatch/game-core";
import { useEffect, useRef, useState } from "react";
import {
  INITIAL_SORT_MESSAGE,
  LEVELS,
  SKINS,
  applyCaptureReward,
  applyLevelReward,
  attemptPour,
  canPour,
  checkWin,
  createSortState,
  loadProfile,
  saveProfile,
  undoSortMove,
  usePowerUp as applyPowerUp,
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
  | "undo"
  | "powerup";

export interface SortFeedbackEvent {
  id: number;
  kind: SortFeedbackKind;
  sourceIndex: number | null;
  destinationIndex: number | null;
}

export function useMatchamatchApp() {
  const [profile, setProfile] = useState<LocalProfile | null>(null);
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
    return createSortState((LEVELS[levelIndex] ?? LEVELS[0]).cups);
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
    ? (LEVELS[profile.currentLevelIndex] ?? LEVELS[0])
    : null;

  function restartLevel() {
    if (!profile || isAdvancingLevel) {
      return;
    }

    setSortState(createLevelState(profile.currentLevelIndex));
  }

  function undoMove() {
    if (!sortState || isAdvancingLevel || sortState.history.length === 0) {
      return;
    }

    emitSortFeedback("undo");
    setSortState(undoSortMove(sortState));
  }

  function onCupPress(index: number) {
    if (!sortState || isAdvancingLevel) {
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

    if (checkWin(nextState.cups) && profile) {
      emitSortFeedback("success", sourceIndex, index);
      setSortState(nextState);
      setIsAdvancingLevel(true);

      const nextProfile = applyLevelReward(profile);
      levelAdvanceTimeoutRef.current = window.setTimeout(() => {
        setProfile(nextProfile);
        setSortState(createLevelState(nextProfile.currentLevelIndex));
        setScorePulseKey((current) => current + 1);
        setIsAdvancingLevel(false);
        levelAdvanceTimeoutRef.current = null;
      }, 260);

      return;
    }

    emitSortFeedback("success", sourceIndex, index);
    setSortState(nextState);
  }

  function useExtraCup() {
    if (!sortState || isAdvancingLevel || sortState.hasAddedCup) {
      return;
    }

    emitSortFeedback("powerup", null, sortState.cups.length);
    setSortState(applyPowerUp(sortState));
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
    undoMove,
    useExtraCup,
    advanceLevel: () =>
      setProfile((current) => (current ? applyLevelReward(current) : current)),
  };
}
