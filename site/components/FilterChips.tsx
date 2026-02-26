"use client";

interface FilterChipsProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export function FilterChips({ options, selected, onSelect }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
            selected === option
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
              : "bg-transparent text-[var(--color-body)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
