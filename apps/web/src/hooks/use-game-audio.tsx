"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const AUDIO_STORAGE_KEY = "matchamatch.audio.v1";
const BGM_AUDIO_PATH = "/audio/bgm.mpeg";
const DEFAULT_MUSIC_ENABLED = true;

type AudioPreference = {
  musicEnabled: boolean;
};

type AudioSettingsContextValue = {
  isPrimed: boolean;
  isSupported: boolean;
  musicEnabled: boolean;
  setMusicEnabled: (next: boolean) => void;
};

const AudioSettingsContext = createContext<AudioSettingsContextValue | null>(
  null,
);

function readStoredPreference(): AudioPreference {
  if (typeof window === "undefined") {
    return { musicEnabled: DEFAULT_MUSIC_ENABLED };
  }

  try {
    const rawValue = window.localStorage.getItem(AUDIO_STORAGE_KEY);

    if (!rawValue) {
      return { musicEnabled: DEFAULT_MUSIC_ENABLED };
    }

    const parsedValue = JSON.parse(rawValue) as Partial<AudioPreference>;
    return {
      musicEnabled: parsedValue.musicEnabled ?? DEFAULT_MUSIC_ENABLED,
    };
  } catch {
    return { musicEnabled: DEFAULT_MUSIC_ENABLED };
  }
}

function writeStoredPreference(preference: AudioPreference) {
  try {
    window.localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(preference));
  } catch {}
}

function getPlaybackErrorName(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof error.name === "string"
  ) {
    return error.name;
  }

  return null;
}

function isRecoverablePlaybackError(error: unknown) {
  const name = getPlaybackErrorName(error);
  return name === "AbortError" || name === "NotAllowedError";
}

function getAudioConstructor() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.Audio;
}

export function AudioSettingsProvider({ children }: { children: ReactNode }) {
  const [musicEnabled, setMusicEnabledState] = useState(DEFAULT_MUSIC_ENABLED);
  const [isPrimed, setIsPrimed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const ensureAudioElement = useCallback(() => {
    if (audioElementRef.current) {
      return audioElementRef.current;
    }

    const AudioCtor = getAudioConstructor();

    if (!AudioCtor) {
      setIsSupported(false);
      return null;
    }

    try {
      const audio = new AudioCtor(BGM_AUDIO_PATH);
      audio.loop = true;
      audio.preload = "auto";
      audio.setAttribute("playsinline", "");
      audioElementRef.current = audio;
      setIsSupported(true);
      return audio;
    } catch {
      setIsSupported(false);
      return null;
    }
  }, []);

  const resumeMusic = useCallback(async () => {
    const audio = ensureAudioElement();

    if (!audio) {
      return false;
    }

    try {
      await audio.play();
      setIsPrimed(true);
      setIsSupported(true);
      return true;
    } catch (error) {
      if (isRecoverablePlaybackError(error)) {
        return false;
      }

      setIsSupported(false);
      return false;
    }
  }, [ensureAudioElement]);

  const suspendMusic = useCallback(async () => {
    const audio = audioElementRef.current;

    if (!audio) {
      return;
    }

    try {
      audio.pause();
    } catch {
      setIsSupported(false);
    }
  }, []);

  const setMusicEnabled = useCallback((next: boolean) => {
    setMusicEnabledState(next);
    writeStoredPreference({ musicEnabled: next });

    if (!next) {
      void suspendMusic();
      return;
    }

    if (document.visibilityState === "visible") {
      void resumeMusic();
    }
  }, [resumeMusic, suspendMusic]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storedPreference = readStoredPreference();
    setMusicEnabledState(storedPreference.musicEnabled);
    writeStoredPreference(storedPreference);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    return () => {
      const audio = audioElementRef.current;

      if (!audio) {
        return;
      }

      try {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (isPrimed) {
      return;
    }

    async function handleFirstGesture() {
      if (!musicEnabled) {
        return;
      }

      const didResume = await resumeMusic();

      if (!didResume) {
        return;
      }

      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    }

    function handlePointerDown() {
      void handleFirstGesture();
    }

    function handleKeyDown() {
      void handleFirstGesture();
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPrimed, musicEnabled, resumeMusic]);

  useEffect(() => {
    async function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        await suspendMusic();
        return;
      }

      if (musicEnabled && isPrimed) {
        await resumeMusic();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPrimed, musicEnabled, resumeMusic, suspendMusic]);

  const value = useMemo<AudioSettingsContextValue>(
    () => ({
      isPrimed,
      isSupported,
      musicEnabled,
      setMusicEnabled,
    }),
    [isPrimed, isSupported, musicEnabled, setMusicEnabled],
  );

  return (
    <AudioSettingsContext.Provider value={value}>
      {children}
    </AudioSettingsContext.Provider>
  );
}

export function useAudioSettings() {
  const context = useContext(AudioSettingsContext);

  if (!context) {
    throw new Error("useAudioSettings must be used within AudioSettingsProvider");
  }

  return context;
}
