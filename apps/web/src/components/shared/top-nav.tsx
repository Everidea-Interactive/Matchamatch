export function TopNav({
  activeTab,
  onTabChange,
}: {
  activeTab: "sort" | "go";
  onTabChange: (tab: "sort" | "go") => void;
}) {
  return (
    <div className="relative mb-5 grid grid-cols-2 rounded-[28px] bg-white/52 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-1.5 left-1.5 rounded-[22px] bg-white/96 shadow-[0_8px_18px_rgba(193,198,170,0.2)] transition-transform duration-300 ease-[var(--mm-ease-spring)]"
        style={{
          transform:
            activeTab === "sort" ? "translateX(0%)" : "translateX(100%)",
          width: "calc(50% - 0.375rem)",
        }}
      />
      <button
        className={
          activeTab === "sort"
            ? "mm-button relative z-10 rounded-[22px] px-4 py-3 text-base font-semibold text-[#3A432E]"
            : "mm-button relative z-10 rounded-[22px] px-4 py-3 text-base font-medium text-[#83866f]"
        }
        onClick={() => onTabChange("sort")}
        type="button"
      >
        Sort
      </button>
      <button
        className={
          activeTab === "go"
            ? "mm-button relative z-10 rounded-[22px] px-4 py-3 text-base font-semibold text-[#3A432E]"
            : "mm-button relative z-10 rounded-[22px] px-4 py-3 text-base font-medium text-[#83866f]"
        }
        onClick={() => onTabChange("go")}
        type="button"
      >
        Go
      </button>
    </div>
  );
}
