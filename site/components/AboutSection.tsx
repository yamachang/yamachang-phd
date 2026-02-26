import { profile } from "@/data/profile";
import { ScrollReveal } from "./ScrollReveal";

export function AboutSection() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <ScrollReveal>
        <h2 className="font-heading text-2xl font-bold mb-8 text-[var(--color-heading)]">
          About
        </h2>
      </ScrollReveal>

      <div className="space-y-5">
        <ScrollReveal delay={0.1}>
          <p className="text-[15px] leading-relaxed">
            Yama Chang (she/her) is a PhD student in the{" "}
            <a
              href="https://geiselmed.dartmouth.edu/qbs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Quantitative Biomedical Sciences (QBS)
            </a>{" "}
            program at Dartmouth College, mentored by Dr. Nicholas Jacobson in
            the{" "}
            <a
              href="https://jacobsonlab.dartmouth.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Artificial Intelligence and Mental Health: Innovation in
              Technology Guided Healthcare (AIM HIGH) Lab
            </a>{" "}
            at the{" "}
            <a
              href="https://www.c4tbh.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Center for Technology and Behavioral Health
            </a>
            .
          </p>
        </ScrollReveal>
        {profile.bio.map((paragraph, i) => (
          <ScrollReveal key={i} delay={0.1 * (i + 2)}>
            <p className="text-[15px] leading-relaxed">{paragraph}</p>
          </ScrollReveal>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
        {/* Research Interests */}
        <ScrollReveal delay={0.2}>
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-4">
              Research Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="text-xs bg-[var(--color-tertiary)]/8 text-[var(--color-tertiary)] px-3 py-1.5 rounded-full border border-[var(--color-tertiary)]/15 accent-glow-hover hover:border-[var(--color-tertiary)]/40 transition-all duration-200 cursor-default"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Education */}
        <ScrollReveal delay={0.3}>
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-4">
              Education
            </h3>
            <div className="relative border-l-2 border-[var(--color-accent)]/20 pl-6 space-y-4">
              {profile.education.map((edu) => (
                <div key={edu.degree} className="relative">
                  <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg)]" />
                  <p className="font-medium text-sm text-[var(--color-heading)]">
                    {edu.degree}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {edu.institution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
