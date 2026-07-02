import type {
  LevelDefinition,
  LocalProfile,
  SortState,
} from "@matchamatch/game-core";
import { CupStack } from "./cup-stack";

export function SortBoard({
  activeLevel,
  onCupPress,
  onRestart,
  onUndo,
  onUsePowerUp,
  profile,
  sortState,
}: {
  activeLevel: LevelDefinition;
  onCupPress: (index: number) => void;
  onRestart: () => void;
  onUndo: () => void;
  onUsePowerUp: () => void;
  profile: LocalProfile;
  sortState: SortState;
}) {
  return (
    <section className="rounded-[28px] bg-[linear-gradient(180deg,rgba(250,252,246,0.96),rgba(238,245,230,0.88))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
      <header className="mb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7A986E]">
              Cafe Level {profile.currentLevelIndex + 1}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#2E3625]">
              {activeLevel.name}
            </h1>
            <p className="mt-2 text-sm font-medium text-[#5D6B4A]">
              {activeLevel.recipe}
            </p>
          </div>
          <div className="rounded-2xl bg-white/75 px-4 py-3 text-right shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8AA07D]">
              Daily Score
            </p>
            <p className="mt-1 text-2xl font-bold text-[#3A432E]">
              {profile.dailyScore}
            </p>
          </div>
        </div>
      </header>

      <div
        className="grid gap-4"
        data-testid="cups-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))",
        }}
      >
        {sortState.cups.map((cup, index) => (
          <CupStack
            key={`${index}-${cup.join("-")}`}
            cup={cup}
            index={index}
            isSelected={sortState.selectedCupIndex === index}
            onPress={() => onCupPress(index)}
          />
        ))}
      </div>

      <p className="mt-4 min-h-6 text-sm font-medium text-[#4C5A3F]">
        {sortState.message}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          aria-label="Undo"
          className="rounded-xl bg-[#3A432E] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-30"
          disabled={sortState.history.length === 0}
          onClick={onUndo}
          type="button"
        >
          Undo
        </button>
        <button
          aria-label="Restart"
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#3A432E] shadow-sm"
          onClick={onRestart}
          type="button"
        >
          Restart
        </button>
        <button
          aria-label="Power Up"
          className="rounded-xl bg-[#76895C] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          disabled={sortState.hasAddedCup}
          onClick={onUsePowerUp}
          type="button"
        >
          {sortState.hasAddedCup ? "Clean Glass Added" : "+ Clean Glass"}
        </button>
      </div>
    </section>
  );
}
