import { ResearchNode } from "@/types";

export const researchNodes: ResearchNode[] = [
  /* ── Pre-PhD (left / top periphery) ── */
  {
    id: "lgbtq-health",
    label: "LGBTQ+ Health",
    category: "pre-phd",
    size: 3,
    description:
      "Identity development, minority stress, structural stigma, and policy-level influences on health outcomes",
    publicationCount: 5,
    connections: ["suicide-prevention", "digital-interventions"],
  },
  {
    id: "suicide-prevention",
    label: "Suicide Prevention",
    category: "pre-phd",
    size: 3,
    description:
      "Ideation trajectories, risk prediction, early adversity, and late-life depression",
    publicationCount: 4,
    connections: ["lgbtq-health", "machine-learning"],
  },
  {
    id: "digital-interventions",
    label: "Digital Interventions",
    category: "pre-phd",
    size: 3,
    description:
      "Single-session interventions, web-based RCTs, and scalable digital tools",
    publicationCount: 2,
    connections: ["lgbtq-health", "ai-mental-health", "jitais"],
  },

  /* ── PhD (right / bottom periphery) ── */
  {
    id: "ai-mental-health",
    label: "AI + Mental Health",
    category: "phd",
    size: 5,
    description:
      "Core research focus: AI-driven mental health systems and adaptive clinical support",
    publicationCount: 0,
    connections: [
      "digital-interventions",
      "machine-learning",
      "jitais",
      "llms",
    ],
  },
  {
    id: "jitais",
    label: "JITAIs",
    category: "phd",
    size: 4,
    description:
      "Just-in-time adaptive interventions powered by passive sensing and wearable data",
    publicationCount: 0,
    connections: ["ai-mental-health", "digital-interventions", "llms", "machine-learning"],
  },
  {
    id: "machine-learning",
    label: "Machine Learning",
    category: "phd",
    size: 3,
    description:
      "XGBoost, elastic net, time-series prediction, and computational psychiatry methods",
    publicationCount: 3,
    connections: ["ai-mental-health", "suicide-prevention", "jitais"],
  },
  {
    id: "llms",
    label: "LLMs & NLP",
    category: "phd",
    size: 3,
    description:
      "Large language models and natural language processing for adaptive clinical support",
    publicationCount: 0,
    connections: ["ai-mental-health", "jitais"],
  },
];
