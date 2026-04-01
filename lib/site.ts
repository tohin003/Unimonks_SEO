export const siteConfig = {
  name: "UNIMONKS",
  shortName: "UNIMONKS CUET",
  title: "UNIMONKS CUET Coaching in Munirka, New Delhi",
  description:
    "SEO-first CUET coaching website for students in Munirka, New Delhi. UNIMONKS focuses on CUET UG and PG strategy, GT, English, domain subjects, and admissions support for DU, JNU, BHU, and other top universities.",
  tagline: "The digital curator of academic excellence.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://unimonks.co.in",
  phoneDisplay: "+91 99106 14532",
  phoneHref: "tel:+919910614532",
  email: "info@unimonks.com",
  whatsappHref: "https://wa.me/919910614532",
  addressLines: [
    "2nd Floor Chhabra Complex, Opp Canara Bank, Laxmi Nagar Market",
    "Munirka, New Delhi 110067",
  ],
  city: "Munirka, New Delhi",
  heroLabel: "CUET coaching in Munirka, New Delhi",
  audience:
    "Students targeting DU, JNU, BHU, central universities, and competitive undergraduate or postgraduate admissions.",
  differentiator:
    "Built around disciplined study systems, admissions clarity, and a content funnel that converts social attention into counseling conversations.",
} as const;

export type Program = {
  name: string;
  summary: string;
  bullets: string[];
};

export const programs: Program[] = [
  {
    name: "CUET UG Foundation",
    summary:
      "For class 11 and 12 students who need steady GT, English, and domain coverage without losing school rhythm.",
    bullets: [
      "Weekly concept mapping for language, GT, and domain subjects.",
      "Revision blocks that reduce last-minute panic and patchy preparation.",
      "Parent-friendly progress checkpoints with realistic next steps.",
    ],
  },
  {
    name: "CUET Target Batch",
    summary:
      "For focused aspirants who want mocks, PYQ practice, rank-oriented strategy, and sharper execution close to the exam.",
    bullets: [
      "Structured mock analysis instead of random test-taking.",
      "Separate drills for reasoning, comprehension, and subject recall.",
      "Answer-review sessions that turn mistakes into repeatable systems.",
    ],
  },
  {
    name: "Admissions & Counseling Desk",
    summary:
      "For students who need help after the exam as much as before it, from college choices to document planning.",
    bullets: [
      "Preference-list support for DU and central university admissions.",
      "Application-form guidance, deadlines, and document readiness.",
      "Counseling sessions tailored to score bands and course goals.",
    ],
  },
];

export type KnowledgeTrack = {
  title: string;
  description: string;
};

export const knowledgeTracks: KnowledgeTrack[] = [
  {
    title: "General Test & Reasoning",
    description:
      "Timed drills, PYQ breakdowns, and habit-based preparation for GT, GK, and reasoning sections.",
  },
  {
    title: "English Language",
    description:
      "Grammar cleanup, vocabulary retention, reading comprehension, and high-yield revision plans.",
  },
  {
    title: "Domain Subjects",
    description:
      "Focused support for streams like Psychology, Commerce, and other CUET domain papers.",
  },
  {
    title: "Admissions Strategy",
    description:
      "College research, DU preference lists, counseling timelines, and post-exam decision making.",
  },
  {
    title: "Application Support",
    description:
      "Form-filling help, document checklists, and deadline awareness for students who do not want avoidable errors.",
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "Why does CUET coaching location still matter if content is online?",
    answer:
      "Location affects consistency. A center in Munirka works when it is easy to reach, easy to revisit for doubts, and close enough for regular mocks, counseling, and parent conversations.",
  },
  {
    question: "Does UNIMONKS focus only on study content or also on admissions?",
    answer:
      "The stronger setup combines both. Students need subject preparation, GT and English strategy, and post-exam guidance around colleges, documents, and counseling windows.",
  },
  {
    question: "What kind of student benefits most from a CUET roadmap page?",
    answer:
      "Students who are overwhelmed by scattered YouTube advice, unsure how to balance GT with domains, or unclear about what happens after the exam benefit the most.",
  },
  {
    question: "Can a blog or knowledge hub actually help rankings for coaching searches?",
    answer:
      "Yes. A focused hub gives search engines and AI systems clear answers around queries like CUET coaching in Munirka, DU admission after CUET, GT preparation, and English strategy.",
  },
  {
    question: "What should a lead capture page offer instead of a generic contact form?",
    answer:
      "It should give a concrete reason to act now, such as a roadmap, counseling call, or admissions checklist, and it should ask only for the details needed to continue the conversation.",
  },
];

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.siteUrl).toString();
}

export function jsonLdString(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
