"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { getDb } from "@/lib/db/client";
import {
  facultyClusters as facultyClustersTable,
  facultyMembers as facultyMembersTable,
} from "@/lib/db/schema";
import { slugify } from "@/lib/posts";

import { recordAudit } from "./audit";
import {
  dbNotConfigured,
  notAuthenticated,
  type ActionResult,
} from "./types";

const FacultyMemberSchema = z.object({
  name: z.string().min(1).max(280),
  honorific: z.string().max(40).optional().or(z.literal("")),
  role: z.string().min(1).max(280),
  qualifications: z.array(z.string().min(1).max(280)).max(10),
  alma: z.array(z.string().min(1).max(280)).max(10),
  subjects: z.array(z.string().min(1).max(280)).max(20),
  bio: z.string().min(1).max(4000),
});

const FacultyClusterSchema = z.object({
  area: z.string().min(1).max(280),
  description: z.string().min(1).max(2000),
  affiliations: z.array(z.string().min(1).max(160)).max(10),
  count: z.string().min(1).max(80),
});

export const FacultyInputSchema = z.object({
  featured: z.array(FacultyMemberSchema).max(40),
  clusters: z.array(FacultyClusterSchema).max(20),
});

export type FacultyInput = z.infer<typeof FacultyInputSchema>;

export async function updateFacultyAction(
  input: FacultyInput,
): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  const db = getDb();
  if (!db) return dbNotConfigured();

  const parsed = FacultyInputSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, message: "Some fields are invalid.", fieldErrors };
  }

  try {
    const beforeMembers = await db.select().from(facultyMembersTable);
    const beforeClusters = await db.select().from(facultyClustersTable);

    await db.delete(facultyMembersTable);
    if (parsed.data.featured.length > 0) {
      const used = new Set<string>();
      const rows = parsed.data.featured.map((member, index) => {
        let base = slugify(member.name) || `member-${index + 1}`;
        let slug = base;
        let n = 2;
        while (used.has(slug)) slug = `${base}-${n++}`;
        used.add(slug);
        return {
          slug,
          name: member.name,
          honorific: member.honorific && member.honorific.length > 0 ? member.honorific : null,
          role: member.role,
          qualifications: member.qualifications,
          alma: member.alma,
          subjects: member.subjects,
          yearsTeaching: null,
          bio: member.bio,
          isFeatured: 1,
          position: index,
        };
      });
      await db.insert(facultyMembersTable).values(rows);
    }

    await db.delete(facultyClustersTable);
    if (parsed.data.clusters.length > 0) {
      const used = new Set<string>();
      const rows = parsed.data.clusters.map((cluster, index) => {
        let base = slugify(cluster.area) || `cluster-${index + 1}`;
        let slug = base;
        let n = 2;
        while (used.has(slug)) slug = `${base}-${n++}`;
        used.add(slug);
        return {
          slug,
          area: cluster.area,
          description: cluster.description,
          affiliations: cluster.affiliations,
          count: cluster.count,
          position: index,
        };
      });
      await db.insert(facultyClustersTable).values(rows);
    }

    const afterMembers = await db.select().from(facultyMembersTable);
    const afterClusters = await db.select().from(facultyClustersTable);

    await recordAudit({
      user: ctx.user,
      action: "update",
      entityType: "faculty",
      entityId: "all",
      before: { members: beforeMembers, clusters: beforeClusters },
      after: { members: afterMembers, clusters: afterClusters },
    });

    revalidatePath("/faculty");
    revalidatePath("/about");
    revalidatePath("/");

    return {
      ok: true,
      message: "Faculty saved. The Faculty and About pages will refresh shortly.",
    };
  } catch (error) {
    console.error("[admin] updateFacultyAction failed", error);
    return { ok: false, message: "Could not save faculty." };
  }
}
