export function TopNav({
  activeTab,
  onTabChange,
}: {
  activeTab: "sort" | "go";
  onTabChange: (tab: "sort" | "go") => void;
}) {
  return (
    <div className="relative mb-3 grid grid-cols-2 rounded-[24px] bg-white/52 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] sm:mb-5 sm:rounded-[28px] sm:p-1.5">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-1 left-1 rounded-[20px] bg-white/96 shadow-[0_8px_18px_rgba(193,198,170,0.2)] transition-transform duration-300 ease-[var(--mm-ease-spring)] sm:inset-y-1.5 sm:left-1.5 sm:rounded-[22px]"
        style={{
          transform:
            activeTab === "sort" ? "translateX(0%)" : "translateX(100%)",
          width: "calc(50% - 0.25rem)",
        }}
      />
      <button
        className={
          activeTab === "sort"
            ? "mm-button relative z-10 rounded-[20px] px-4 py-2.5 text-[0.95rem] font-semibold text-[#3A432E] sm:rounded-[22px] sm:py-3 sm:text-base"
            : "mm-button relative z-10 rounded-[20px] px-4 py-2.5 text-[0.95rem] font-medium text-[#83866f] sm:rounded-[22px] sm:py-3 sm:text-base"
        }
        onClick={() => onTabChange("sort")}
        type="button"
      >
        Sort
      </button>
      <button
        className={
          activeTab === "go"
            ? "mm-button relative z-10 rounded-[20px] px-4 py-2.5 text-[0.95rem] font-semibold text-[#3A432E] sm:rounded-[22px] sm:py-3 sm:text-base"
            : "mm-button relative z-10 rounded-[20px] px-4 py-2.5 text-[0.95rem] font-medium text-[#83866f] sm:rounded-[22px] sm:py-3 sm:text-base"
        }
        onClick={() => onTabChange("go")}
        type="button"
      >
        Go
      </button>
    </div>
  );
}
