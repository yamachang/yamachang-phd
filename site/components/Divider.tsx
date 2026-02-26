export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`max-w-[65ch] mx-auto px-6 py-4 ${className}`}>
      <svg
        viewBox="0 0 400 12"
        className="w-full h-3 text-[var(--color-border)]"
        preserveAspectRatio="none"
      >
        <path
          d="M0 6 Q50 2, 100 6 T200 6 T300 6 T400 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
