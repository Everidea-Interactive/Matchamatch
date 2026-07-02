"use client";

import { useEffect, useState } from "react";
import {
  LEVELS,
  SKINS,
  applyCaptureReward,
  applyLevelReward,
  attemptPour,
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

export function useMatchamatchApp() {
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [sortState, setSortState] = useState<SortState | null>(null);
  const [activeTab, setActiveTab] = useState<"sort" | "go">("sort");
  const [scannerFeedback, setScannerFeedback] = useState(
    "Point camera at Matcha or upload a drink photo.",
  );

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const nextProfile = loadProfile(window.localStorage);
    setProfile(nextProfile);
    setSortState(createSortState(LEVELS[nextProfile.currentLevelIndex].cups));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!profile) {
      return;
    }

    saveProfile(window.localStorage, profile);
  }, [profile]);

  const activeLevel = profile
    ? (LEVELS[profile.currentLevelIndex] ?? LEVELS[0])
    : null;

  function restartLevel() {
    setSortState((current) =>
      current && profile
        ? createSortState(LEVELS[profile.currentLevelIndex].cups)
        : current,
    );
  }

  function undoMove() {
    setSortState((current) => (current ? undoSortMove(current) : current));
  }

  function onCupPress(index: number) {
    setSortState((current) => {
      if (!current) {
        return current;
      }

      if (current.selectedCupIndex === null) {
        if (current.cups[index]?.length) {
          return {
            ...current,
            selectedCupIndex: index,
            message: "Glass selected. Tap another glass to pour.",
          };
        }

        return {
          ...current,
          message: "That glass is empty. Choose another glass!",
        };
      }

      if (current.selectedCupIndex === index) {
        return {
          ...current,
          selectedCupIndex: null,
          message: "Deselected glass. Select a cup to start.",
        };
      }

      const nextState = attemptPour(current, current.selectedCupIndex, index);

      if (checkWin(nextState.cups)) {
        setProfile((currentProfile) =>
          currentProfile ? applyLevelReward(currentProfile) : currentProfile,
        );

        return {
          ...nextState,
          message: "Level complete! Reward unlocked.",
        };
      }

      return nextState;
    });
  }

  function useExtraCup() {
    setSortState((current) => (current ? applyPowerUp(current) : current));
  }

  function applyScannerResult(result: MatchaDetection) {
    setProfile((current) => {
      if (!current) {
        return current;
      }

      const nextProfile = applyCaptureReward(current, result.isMatcha);
      const unlockedNames = SKINS.filter(
        (skin) =>
          !current.unlockedSkins.includes(skin.id) &&
          nextProfile.unlockedSkins.includes(skin.id),
      ).map((skin) => `${skin.name} ${skin.emoji}`);

      let alertMessage = result.isMatcha
        ? "Real green Matcha segmented! Restored +100 Pts."
        : "Daily cup segment restored! +100 Pts.";

      if (unlockedNames.length > 0) {
        alertMessage += ` Unlocked ${unlockedNames.join(" & ")} skin!`;
      }

      setScannerFeedback(alertMessage);
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
    restartLevel,
    scannerFeedback,
    setActiveTab,
    setProfile,
    setSortState,
    sortState,
    undoMove,
    useExtraCup,
    advanceLevel: () =>
      setProfile((current) => (current ? applyLevelReward(current) : current)),
  };
}
