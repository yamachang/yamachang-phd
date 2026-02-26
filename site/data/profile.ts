import { Profile } from "@/types";

export const profile: Profile = {
  name: "Ya-Wen (Yama) Chang",
  shortName: "Yama Chang",
  role: "PhD Student in Quantitative Biomedical Science",
  affiliation: "Center for Technology and Behavioral Health, Dartmouth College",
  affiliationUrl: "https://www.c4tbh.org/",
  bio: [
    "Her research focuses on leveraging passive sensing, wearable devices, large language models (LLMs), and just-in-time adaptive interventions (JITAIs) to deliver scalable, personalized support for mental wellness. As part of the Evergreen AI initiative at Dartmouth, Yama is conducting research on the design and evaluation of a real-time, campus-wide intervention system that integrates multimodal data streams with LLM-based decision engines to deliver safe and adaptive support for undergraduate students. More broadly, she is interested in optimizing the timing of digital interventions and advancing clinical safety in AI-driven mental health systems.",
  ],
  interests: [
    "Digital Mental Health Interventions",
    "Just-in-Time Adaptive Interventions",
    "AI-driven Mental Health",
    "Multimodal Sensing",
    "Psychedelics Research",
  ],
  education: [
    {
      degree: "PhD in Quantitative Biomedical Science",
      institution: "Dartmouth College",
    },
    { degree: "MA in Clinical Psychology", institution: "Columbia University" },
    { degree: "BA in Economics", institution: "National Taiwan University" },
  ],
  social: [
    {
      platform: "Email",
      url: "mailto:yama.chang.gr@dartmouth.edu",
      icon: "mail",
    },
    {
      platform: "Google Scholar",
      url: "https://scholar.google.com/citations?user=AFAYk_sAAAAJ",
      icon: "graduation-cap",
    },
    { platform: "OSF", url: "https://osf.io/v9r5z", icon: "archive" },
    {
      platform: "Twitter",
      url: "https://twitter.com/yama_ywchang",
      icon: "twitter",
    },
    { platform: "GitHub", url: "https://github.com/yamachang", icon: "github" },
    { platform: "CV", url: "/cv.pdf", icon: "file-text" },
  ],
  email: "yama.chang.gr@dartmouth.edu",
};
