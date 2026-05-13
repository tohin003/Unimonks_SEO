import type { Metadata } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site";

export type FacultyMember = {
  slug: string;
  name: string;
  honorific?: string;
  role: string;
  qualifications: string[];
  alma: string[];
  subjects: string[];
  yearsTeaching?: number;
  bio: string;
};

export type FacultyClusterCard = {
  area: string;
  description: string;
  affiliations: string[];
  count: string;
};

export const featuredFaculty: FacultyMember[] = [
  {
    slug: "arvind-rao",
    name: "Arvind Rao",
    honorific: "Dr",
    role: "Founder & Academic Director",
    qualifications: ["PhD"],
    alma: ["Jawaharlal Nehru University"],
    subjects: [
      "Academic strategy",
      "General Test",
      "Domain subject planning",
    ],
    bio:
      "Dr Arvind Rao founded UNIMONKS in 2022 with the conviction that CUET preparation in Delhi was missing a setup that treated GT, English, domain subjects, and admissions as one coordinated programme. He leads the academic vision at the Munirka centre, sets the batch structure across Foundation and Target tracks, and works closely with each faculty cluster on the weekly study rhythm. His teaching background and university research mean the room stays grounded in concept depth rather than test-taking shortcuts.",
  },
];

// Subject-area summary used while individual faculty profiles are verified
// before publication. Counts and affiliations reflect the verified roster
// (18+ faculty from JNU, IIT, and DU per AcademyCheck listing) without
// publishing names that have not yet been individually consented.
export const facultyClusters: FacultyClusterCard[] = [
  {
    area: "General Test & Reasoning",
    description:
      "GT, quantitative reasoning, and logical reasoning faculty who teach the section as one connected paper rather than as three separate topics.",
    affiliations: ["JNU", "Delhi University", "IIT Delhi"],
    count: "4 specialists",
  },
  {
    area: "English Language",
    description:
      "Reading comprehension, grammar, and vocabulary instructors with university teaching backgrounds. Strong on timed reading and error-pattern revision.",
    affiliations: ["JNU", "Delhi University"],
    count: "3 specialists",
  },
  {
    area: "Psychology",
    description:
      "Domain faculty for CUET Psychology with NCERT command, applied-example fluency, and one-page revision-map methods for last-month retention.",
    affiliations: ["JNU", "Delhi University"],
    count: "2 specialists",
  },
  {
    area: "Commerce: Business Studies, Accountancy, Economics",
    description:
      "Three-paper Commerce coverage taught as one batch so that Business Studies, Accountancy, and Economics revise together rather than in isolated cycles.",
    affiliations: ["Delhi University", "JNU"],
    count: "3 specialists",
  },
  {
    area: "Humanities: History, Political Science, Sociology",
    description:
      "Humanities domain faculty with strong NCERT plus board-text command. Teaches with comparison frameworks that match the CUET case-question pattern.",
    affiliations: ["JNU", "Delhi University"],
    count: "3 specialists",
  },
  {
    area: "Admissions & Counseling",
    description:
      "Dedicated admissions desk that handles DU CSAS, JNU UG, BHU, and central university preference lists, plus document and timeline support.",
    affiliations: ["Delhi University", "JNU"],
    count: "2 counselors",
  },
];

export function getFacultyMemberBySlug(slug: string) {
  return featuredFaculty.find((member) => member.slug === slug);
}

export function buildFacultyPageMetadata(): Metadata {
  return {
    title: "UNIMONKS Faculty — JNU, IIT, and DU teachers in Munirka",
    description:
      "Meet the faculty behind UNIMONKS CUET coaching in Munirka — 18+ teachers from JNU, IIT, and Delhi University covering GT, English, Psychology, Commerce, Humanities, and DU admissions counseling.",
    alternates: { canonical: "/faculty" },
    keywords: [
      "UNIMONKS faculty",
      "CUET coaching faculty in Munirka",
      "JNU PhD CUET teacher",
      "DU CUET coaching team",
      "CUET Psychology teacher",
    ],
    openGraph: {
      title: "UNIMONKS Faculty — CUET coaching team in Munirka",
      description:
        "JNU, IIT, and Delhi University faculty teaching GT, English, Psychology, Commerce, and Humanities at the UNIMONKS Munirka centre.",
      url: absoluteUrl("/faculty"),
      type: "profile",
    },
  };
}

export function buildFacultyPersonSchemas(
  members: FacultyMember[] = featuredFaculty,
) {
  return members.map((member) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.honorific ? `${member.honorific} ${member.name}` : member.name,
    jobTitle: member.role,
    knowsAbout: member.subjects,
    alumniOf: member.alma.map((institution) => ({
      "@type": "EducationalOrganization",
      name: institution,
    })),
    worksFor: { "@id": `${siteConfig.siteUrl}/#org` },
  }));
}
