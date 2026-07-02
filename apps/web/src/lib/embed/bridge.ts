import type { GameToHostMessage } from "./messages";

export function postToHost(message: GameToHostMessage) {
  if (typeof window === "undefined") {
    return;
  }

  if (window.parent === window) {
    return;
  }

  window.parent.postMessage(message, "*");
}
