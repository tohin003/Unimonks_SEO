import type { Metadata } from "next";

import type { FacultyInput } from "@/app/admin/_actions/faculty";
import {
  getFacultyClusters,
  getFeaturedFaculty,
} from "@/lib/content/faculty";
import { isDbConfigured } from "@/lib/db/client";

import { FacultyEditor } from "./faculty-editor";

export const metadata: Metadata = { title: "Faculty page" };

export default async function AdminFacultyContentPage() {
  const [featured, clusters] = await Promise.all([
    getFeaturedFaculty(),
    getFacultyClusters(),
  ]);

  const initial: FacultyInput = {
    featured: featured.map((member) => ({
      name: member.name,
      honorific: member.honorific ?? "",
      role: member.role,
      qualifications: [...member.qualifications],
      alma: [...member.alma],
      subjects: [...member.subjects],
      bio: member.bio,
    })),
    clusters: clusters.map((cluster) => ({
      area: cluster.area,
      description: cluster.description,
      affiliations: [...cluster.affiliations],
      count: cluster.count,
    })),
  };

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Pages · Faculty</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Edit the Faculty page roster and cluster cards.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Featured faculty appear with full bios on /faculty and the founder
          card pulls from this list onto /about. Cluster cards describe
          subject groupings whose individual profiles are not yet published.
        </p>
      </header>
      <FacultyEditor initial={initial} dbConfigured={isDbConfigured()} />
    </div>
  );
}
