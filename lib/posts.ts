import { promises as fs } from "node:fs";
import path from "node:path";

export type PostSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type PostRecord = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  seoQuery: string;
  quickAnswer: string;
  takeaways: string[];
  body: string;
  published: boolean;
  updatedAt?: string;
};

export type Post = PostRecord & {
  sections: PostSection[];
};

const postsFilePath = path.join(process.cwd(), "data", "posts.json");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readStringList(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => readString(item)).filter(Boolean)
    : [];
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function normalizeStoredPost(value: unknown): PostRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  const title = readString(value.title);
  const fallbackSlug = slugify(title);
  const slug = slugify(readString(value.slug) || fallbackSlug);
  const description = readString(value.description);
  const excerpt = readString(value.excerpt);
  const category = readString(value.category);
  const date = readString(value.date);
  const readingTime = readString(value.readingTime);
  const seoQuery = readString(value.seoQuery);
  const quickAnswer = readString(value.quickAnswer);
  const body = readString(value.body);
  const takeaways = readStringList(value.takeaways);
  const published =
    typeof value.published === "boolean" ? value.published : true;
  const updatedAt = readString(value.updatedAt);

  if (
    !slug ||
    !title ||
    !description ||
    !excerpt ||
    !category ||
    !date ||
    !readingTime ||
    !seoQuery ||
    !quickAnswer ||
    !body
  ) {
    return null;
  }

  return {
    slug,
    title,
    description,
    excerpt,
    category,
    date,
    readingTime,
    seoQuery,
    quickAnswer,
    takeaways,
    body,
    published,
    updatedAt: updatedAt || undefined,
  };
}

async function readPostsFile() {
  try {
    const raw = await fs.readFile(postsFilePath, "utf8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry) => normalizeStoredPost(entry))
      .filter((entry): entry is PostRecord => Boolean(entry));
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }

    throw error;
  }
}

function parseBodyBlock(block: string) {
  const trimmedBlock = block.trim();

  if (!trimmedBlock) {
    return null;
  }

  const lines = trimmedBlock
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return null;
  }

  const allBullets = lines.every((line) => /^[-*]\s+/.test(line));

  if (allBullets) {
    return {
      type: "bullets" as const,
      value: lines.map((line) => line.replace(/^[-*]\s+/, "").trim()),
    };
  }

  return {
    type: "paragraph" as const,
    value: trimmedBlock.replace(/\s*\n\s*/g, " ").trim(),
  };
}

function parsePostBody(body: string): PostSection[] {
  const normalized = body.replace(/\r\n/g, "\n").trim();

  if (!normalized) {
    return [];
  }

  const parts = normalized
    .split(/\n(?=##\s+)/)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts
    .map((part, index) => {
      const lines = part.split("\n");
      const firstLine = lines[0]?.trim() ?? "";
      const hasHeading = firstLine.startsWith("## ");
      const heading = hasHeading
        ? firstLine.replace(/^##\s+/, "").trim()
        : index === 0
          ? "Overview"
          : `Section ${index + 1}`;
      const content = hasHeading ? lines.slice(1).join("\n") : part;
      const blocks = content
        .split(/\n\s*\n/)
        .map((block) => parseBodyBlock(block))
        .filter(Boolean);
      const paragraphs: string[] = [];
      const bullets: string[] = [];

      blocks.forEach((block) => {
        if (!block) {
          return;
        }

        if (block.type === "paragraph") {
          paragraphs.push(block.value);
        } else {
          bullets.push(...block.value);
        }
      });

      return {
        heading,
        paragraphs,
        bullets: bullets.length ? bullets : undefined,
      };
    })
    .filter((section) => section.paragraphs.length || section.bullets?.length);
}

function toPost(record: PostRecord): Post {
  return {
    ...record,
    sections: parsePostBody(record.body),
  };
}

function sortPosts(a: PostRecord, b: PostRecord) {
  const aStamp = a.updatedAt || a.date;
  const bStamp = b.updatedAt || b.date;

  return bStamp.localeCompare(aStamp);
}

function scoreRelatedPost(current: Post, candidate: Post) {
  let score = 0;

  if (candidate.category === current.category) {
    score += 3;
  }

  const currentWords = new Set(
    `${current.title} ${current.seoQuery}`.toLowerCase().split(/\W+/),
  );
  const candidateWords = new Set(
    `${candidate.title} ${candidate.seoQuery}`.toLowerCase().split(/\W+/),
  );

  candidateWords.forEach((word) => {
    if (word.length > 2 && currentWords.has(word)) {
      score += 1;
    }
  });

  return score;
}

function validateDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function getPosts(options?: { includeDrafts?: boolean }) {
  const includeDrafts = options?.includeDrafts ?? false;
  const records = await readPostsFile();

  return records
    .filter((post) => includeDrafts || post.published)
    .sort(sortPosts)
    .map((post) => toPost(post));
}

export async function getFeaturedPosts(limit = 3) {
  const posts = await getPosts();

  return posts.slice(0, limit);
}

export async function getPostBySlug(
  slug: string,
  options?: { includeDrafts?: boolean },
) {
  const posts = await getPosts(options);

  return posts.find((post) => post.slug === slug);
}

export async function getRelatedPosts(slug: string, limit = 3) {
  const posts = await getPosts();
  const current = posts.find((post) => post.slug === slug);

  if (!current) {
    return [];
  }

  return posts
    .filter((post) => post.slug !== slug)
    .sort((a, b) => {
      const scoreDiff = scoreRelatedPost(current, b) - scoreRelatedPost(current, a);

      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      return sortPosts(a, b);
    })
    .slice(0, limit);
}

function ensureRequired(value: string, field: string) {
  if (!value) {
    throw new Error(`Missing field: ${field}`);
  }

  return value;
}

function normalizeInput(input: unknown, existingSlug?: string): PostRecord {
  if (!isRecord(input)) {
    throw new Error("Invalid post payload");
  }

  const title = ensureRequired(readString(input.title), "title");
  const slug = slugify(readString(input.slug) || title || existingSlug || "");
  const description = ensureRequired(readString(input.description), "description");
  const excerpt = ensureRequired(readString(input.excerpt), "excerpt");
  const category = ensureRequired(readString(input.category), "category");
  const date = ensureRequired(readString(input.date), "date");
  const readingTime = ensureRequired(readString(input.readingTime), "readingTime");
  const seoQuery = ensureRequired(readString(input.seoQuery), "seoQuery");
  const quickAnswer = ensureRequired(
    readString(input.quickAnswer),
    "quickAnswer",
  );
  const body = ensureRequired(readString(input.body), "body");
  const takeaways = readStringList(input.takeaways);
  const published = Boolean(input.published);

  if (!slug) {
    throw new Error("A title or slug is required");
  }

  if (!validateDate(date)) {
    throw new Error("Publish date must use YYYY-MM-DD");
  }

  return {
    slug,
    title,
    description,
    excerpt,
    category,
    date,
    readingTime,
    seoQuery,
    quickAnswer,
    takeaways,
    body,
    published,
    updatedAt: new Date().toISOString(),
  };
}

async function writePostsFile(posts: PostRecord[]) {
  await fs.mkdir(path.dirname(postsFilePath), { recursive: true });
  await fs.writeFile(postsFilePath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
}

export async function savePost(input: unknown, existingSlug?: string) {
  const nextPost = normalizeInput(input, existingSlug);
  const posts = await readPostsFile();

  const hasSlugConflict = posts.some(
    (post) => post.slug === nextPost.slug && post.slug !== existingSlug,
  );

  if (hasSlugConflict) {
    throw new Error("Another post already uses this slug");
  }

  const nextPosts = posts.filter((post) => post.slug !== existingSlug);
  nextPosts.push(nextPost);
  nextPosts.sort(sortPosts);

  await writePostsFile(nextPosts);

  return toPost(nextPost);
}

export async function deletePost(slug: string) {
  const posts = await readPostsFile();
  const nextPosts = posts.filter((post) => post.slug !== slug);

  if (nextPosts.length === posts.length) {
    return false;
  }

  await writePostsFile(nextPosts);

  return true;
}
