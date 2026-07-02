export function TopNav({
  activeTab,
  onTabChange,
}: {
  activeTab: "sort" | "go";
  onTabChange: (tab: "sort" | "go") => void;
}) {
  return (
    <div className="mb-4 flex rounded-2xl bg-white/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
      <button
        className={
          activeTab === "sort"
            ? "flex-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#3A432E] shadow-sm"
            : "flex-1 rounded-xl px-4 py-2 text-sm font-medium text-[#5D6B4A]"
        }
        onClick={() => onTabChange("sort")}
        type="button"
      >
        Sort
      </button>
      <button
        className={
          activeTab === "go"
            ? "flex-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#3A432E] shadow-sm"
            : "flex-1 rounded-xl px-4 py-2 text-sm font-medium text-[#5D6B4A]"
        }
        onClick={() => onTabChange("go")}
        type="button"
      >
        Go
      </button>
    </div>
  );
}
