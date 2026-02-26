import Image from "next/image";
import { profile } from "@/data/profile";
import { ResearchNetwork } from "./ResearchNetwork";
import { CursorGlow } from "./CursorGlow";
import { GradientReveal } from "./GradientReveal";
import { SocialIcons } from "./SocialIcons";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <ResearchNetwork />
      <CursorGlow />
      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 items-center">
          {/* Left column */}
          <div className="space-y-5 animate-fade-up">
            <GradientReveal
              text="From clinical insight to intelligent intervention"
              className="text-sm md:text-base text-[var(--color-accent)] font-medium tracking-wide uppercase block mb-4"
            />
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-heading)] leading-tight tracking-tight">
              {profile.name}
            </h1>
            <p
              className="text-lg text-[var(--color-body)] animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              {profile.role}
            </p>
            <p
              className="text-sm text-[var(--color-muted)] animate-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              <a
                href={profile.affiliationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--color-accent)] transition-colors"
              >
                {profile.affiliation}
              </a>
            </p>
            <div
              className="flex items-center gap-5 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <SocialIcons />
              <span className="w-px h-5 bg-[var(--color-border)]" />
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-highlight)] border border-[var(--color-highlight)] px-4 py-2 rounded-full hover:bg-[var(--color-highlight)] hover:text-white transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download CV
              </a>
            </div>
          </div>

          {/* Right column — avatar */}
          <div
            className="flex justify-center md:justify-end animate-fade-up"
            style={{ animationDelay: "0.25s" }}
          >
            <Image
              src="/avatar.jpg"
              alt={profile.name}
              width={280}
              height={280}
              className="rounded-full ring-4 ring-[var(--color-accent)]/20 object-cover w-56 h-56 md:w-72 md:h-72 animate-ring-pulse"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
