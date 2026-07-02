export function CupStack({
  cup,
  index,
  isSelected,
  onPress,
}: {
  cup: string[];
  index: number;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <button
      aria-label={`Cup ${index + 1}`}
      className={
        isSelected
          ? "flex h-40 flex-col-reverse overflow-hidden rounded-[28px] border-2 border-[#3A432E] bg-white/75 shadow-[0_20px_40px_rgba(58,67,46,0.14)] ring-4 ring-[#C6D6B8]/80 transition"
          : "flex h-40 flex-col-reverse overflow-hidden rounded-[28px] border-2 border-[#3A432E]/15 bg-white/55 shadow-[0_16px_32px_rgba(58,67,46,0.10)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(58,67,46,0.14)]"
      }
      data-testid={`cup-${index}`}
      onClick={onPress}
      type="button"
    >
      {cup.length === 0 ? (
        <span className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.3em] text-[#9AAC8D]">
          Empty
        </span>
      ) : null}
      {cup.map((color, layerIndex) => (
        <span
          key={`${index}-${layerIndex}-${color}`}
          className="block h-1/3 w-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </button>
  );
}
