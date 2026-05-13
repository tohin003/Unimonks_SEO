import { asc, desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import {
  facultyClusters as facultyClustersTable,
  facultyMembers as facultyMembersTable,
} from "@/lib/db/schema";
import {
  facultyClusters as facultyClustersFallback,
  featuredFaculty as featuredFacultyFallback,
  type FacultyClusterCard,
  type FacultyMember,
} from "@/lib/faculty";

export async function getFeaturedFaculty(): Promise<FacultyMember[]> {
  const db = getDb();
  if (!db) return [...featuredFacultyFallback];

  try {
    const rows = await db
      .select()
      .from(facultyMembersTable)
      .where(eq(facultyMembersTable.isFeatured, 1))
      .orderBy(asc(facultyMembersTable.position), desc(facultyMembersTable.updatedAt));

    if (rows.length === 0) return [...featuredFacultyFallback];

    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      honorific: row.honorific ?? undefined,
      role: row.role,
      qualifications: row.qualifications ?? [],
      alma: row.alma ?? [],
      subjects: row.subjects ?? [],
      yearsTeaching: row.yearsTeaching ?? undefined,
      bio: row.bio,
    }));
  } catch (error) {
    console.error("[content] getFeaturedFaculty failed", error);
    return [...featuredFacultyFallback];
  }
}

export async function getFacultyClusters(): Promise<FacultyClusterCard[]> {
  const db = getDb();
  if (!db) return [...facultyClustersFallback];

  try {
    const rows = await db
      .select()
      .from(facultyClustersTable)
      .orderBy(asc(facultyClustersTable.position));

    if (rows.length === 0) return [...facultyClustersFallback];

    return rows.map((row) => ({
      area: row.area,
      description: row.description,
      affiliations: row.affiliations ?? [],
      count: row.count,
    }));
  } catch (error) {
    console.error("[content] getFacultyClusters failed", error);
    return [...facultyClustersFallback];
  }
}
