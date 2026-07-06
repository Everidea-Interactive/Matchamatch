export function TopNav({
  activeTab,
  onOpenHelp,
  onTabChange,
}: {
  activeTab: "sort" | "go";
  onOpenHelp: () => void;
  onTabChange: (tab: "sort" | "go") => void;
}) {
  return (
    <div className="mb-3 flex items-center gap-2 sm:mb-5 sm:gap-3">
      <div className="relative grid flex-1 grid-cols-2 rounded-[24px] border border-[var(--mm-border)] bg-[rgba(250,244,236,0.84)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_10px_24px_rgba(var(--mm-shadow-rgb),0.08)] sm:rounded-[28px] sm:p-1.5">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-1 left-1 rounded-[20px] bg-[linear-gradient(180deg,var(--mm-sage-soft),var(--mm-sage))] shadow-[0_8px_18px_rgba(142,160,114,0.24)] transition-transform duration-300 ease-[var(--mm-ease-spring)] sm:inset-y-1.5 sm:left-1.5 sm:rounded-[22px]"
          style={{
            transform:
              activeTab === "sort" ? "translateX(0%)" : "translateX(100%)",
            width: "calc(50% - 0.25rem)",
          }}
        />
        <button
          className={
            activeTab === "sort"
              ? "mm-button relative z-10 rounded-[20px] px-4 py-2.5 text-[0.95rem] font-semibold text-[var(--mm-ink-strong)] sm:rounded-[22px] sm:py-3 sm:text-base"
              : "mm-button relative z-10 rounded-[20px] px-4 py-2.5 text-[0.95rem] font-medium text-[var(--mm-muted)] sm:rounded-[22px] sm:py-3 sm:text-base"
          }
          onClick={() => onTabChange("sort")}
          type="button"
        >
          Sort
        </button>
        <button
          className={
            activeTab === "go"
              ? "mm-button relative z-10 rounded-[20px] px-4 py-2.5 text-[0.95rem] font-semibold text-[var(--mm-ink-strong)] sm:rounded-[22px] sm:py-3 sm:text-base"
              : "mm-button relative z-10 rounded-[20px] px-4 py-2.5 text-[0.95rem] font-medium text-[var(--mm-muted)] sm:rounded-[22px] sm:py-3 sm:text-base"
          }
          onClick={() => onTabChange("go")}
          type="button"
        >
          Go
        </button>
      </div>
      <button
        aria-label="Help & Tutorial"
        className="mm-button flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] border border-[var(--mm-border)] bg-[rgba(255,249,241,0.9)] text-[0.78rem] font-semibold text-[var(--mm-ink-strong)] shadow-[0_10px_24px_rgba(var(--mm-shadow-rgb),0.08)] sm:h-12 sm:w-12 sm:rounded-[24px] sm:text-[0.9rem]"
        onClick={onOpenHelp}
        type="button"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--mm-sage-soft),var(--mm-sage))] text-[11px] font-bold text-[var(--mm-ink-strong)] sm:h-6 sm:w-6">
          ?
        </span>
      </button>
    </div>
  );
}
