export function TopNav({
  activeTab,
  onTabChange,
}: {
  activeTab: "sort" | "go";
  onTabChange: (tab: "sort" | "go") => void;
}) {
  return (
    <div className="relative mb-4 grid grid-cols-2 rounded-2xl bg-white/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-1 left-1 rounded-xl bg-white shadow-sm transition-transform duration-300 ease-[var(--mm-ease-spring)]"
        style={{
          transform:
            activeTab === "sort" ? "translateX(0%)" : "translateX(100%)",
          width: "calc(50% - 0.25rem)",
        }}
      />
      <button
        className={
          activeTab === "sort"
            ? "mm-button relative z-10 rounded-xl px-4 py-2 text-sm font-semibold text-[#3A432E]"
            : "mm-button relative z-10 rounded-xl px-4 py-2 text-sm font-medium text-[#5D6B4A]"
        }
        onClick={() => onTabChange("sort")}
        type="button"
      >
        Sort
      </button>
      <button
        className={
          activeTab === "go"
            ? "mm-button relative z-10 rounded-xl px-4 py-2 text-sm font-semibold text-[#3A432E]"
            : "mm-button relative z-10 rounded-xl px-4 py-2 text-sm font-medium text-[#5D6B4A]"
        }
        onClick={() => onTabChange("go")}
        type="button"
      >
        Go
      </button>
    </div>
  );
}
