import { PublicationStatus } from "@/types";

const statusConfig: Record<PublicationStatus, { color: string; label: string; pulse: boolean }> = {
  published: { color: "bg-[var(--color-accent)]", label: "Published", pulse: false },
  "in-press": { color: "bg-[var(--color-highlight)]", label: "In Press", pulse: true },
  "under-review": { color: "bg-[var(--color-highlight)]", label: "Under Review", pulse: true },
  "in-prep": { color: "bg-[var(--color-muted)]", label: "In Preparation", pulse: true },
};

export function StatusDot({ status }: { status: PublicationStatus }) {
  const config = statusConfig[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${config.color} ${config.pulse ? "animate-dot-pulse" : ""}`} />
      <span className="font-mono text-xs text-[var(--color-muted)]">{config.label}</span>
    </span>
  );
}
