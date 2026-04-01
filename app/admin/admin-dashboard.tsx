"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { Post } from "@/lib/posts";

type AdminDashboardProps = {
  initialPosts: Post[];
  authenticated: boolean;
  protectedMode: boolean;
};

type PostEditorState = {
  title: string;
  slug: string;
  category: string;
  date: string;
  readingTime: string;
  seoQuery: string;
  description: string;
  excerpt: string;
  quickAnswer: string;
  takeaways: string;
  body: string;
  published: boolean;
};

function createEmptyPost(): PostEditorState {
  return {
    title: "",
    slug: "",
    category: "CUET Guidance",
    date: new Date().toISOString().slice(0, 10),
    readingTime: "6 min read",
    seoQuery: "",
    description: "",
    excerpt: "",
    quickAnswer: "",
    takeaways: "",
    body: "## Overview\nWrite a clear introduction for students and parents.\n\n## What students should know\nAdd practical guidance in short paragraphs.\n\n- Use bullet points for quick steps\n- Keep advice specific and readable\n\n## What to do next\nEnd with the next action a student should take.",
    published: true,
  };
}

function postToEditorState(post: Post): PostEditorState {
  return {
    title: post.title,
    slug: post.slug,
    category: post.category,
    date: post.date,
    readingTime: post.readingTime,
    seoQuery: post.seoQuery,
    description: post.description,
    excerpt: post.excerpt,
    quickAnswer: post.quickAnswer,
    takeaways: post.takeaways.join("\n"),
    body: post.body,
    published: post.published,
  };
}

function editorStateToPayload(form: PostEditorState) {
  return {
    ...form,
    takeaways: form.takeaways
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

export function AdminDashboard({
  initialPosts,
  authenticated,
  protectedMode,
}: AdminDashboardProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    initialPosts[0]?.slug ?? null,
  );
  const [form, setForm] = useState<PostEditorState>(
    initialPosts[0] ? postToEditorState(initialPosts[0]) : createEmptyPost(),
  );
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedPost = posts.find((post) => post.slug === selectedSlug);

  function selectPost(post: Post) {
    setSelectedSlug(post.slug);
    setForm(postToEditorState(post));
    setMessage(null);
    setError(null);
  }

  function startNewPost() {
    setSelectedSlug(null);
    setForm(createEmptyPost());
    setMessage("Ready to draft a new blog post.");
    setError(null);
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
    const data = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    if (!response.ok) {
      setError(data?.message ?? "Login failed.");
      return;
    }

    setPassword("");
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleLogout() {
    setMessage(null);
    setError(null);

    await fetch("/api/admin/session", { method: "DELETE" });
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const endpoint = selectedSlug
      ? `/api/admin/posts/${selectedSlug}`
      : "/api/admin/posts";
    const method = selectedSlug ? "PUT" : "POST";
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editorStateToPayload(form)),
    });
    const data = (await response.json().catch(() => null)) as
      | { message?: string; post?: Post; posts?: Post[] }
      | null;

    if (!response.ok || !data?.post || !data.posts) {
      setError(data?.message ?? "The post could not be saved.");
      return;
    }

    setPosts(data.posts);
    setSelectedSlug(data.post.slug);
    setForm(postToEditorState(data.post));
    setMessage(
      data.post.published
        ? "Post published successfully."
        : "Draft saved successfully.",
    );
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleDelete() {
    if (!selectedSlug) {
      return;
    }

    if (!window.confirm("Delete this post permanently?")) {
      return;
    }

    setMessage(null);
    setError(null);

    const response = await fetch(`/api/admin/posts/${selectedSlug}`, {
      method: "DELETE",
    });
    const data = (await response.json().catch(() => null)) as
      | { message?: string; posts?: Post[] }
      | null;

    if (!response.ok || !data?.posts) {
      setError(data?.message ?? "The post could not be deleted.");
      return;
    }

    setPosts(data.posts);
    const nextPost = data.posts[0];
    setSelectedSlug(nextPost?.slug ?? null);
    setForm(nextPost ? postToEditorState(nextPost) : createEmptyPost());
    setMessage("Post deleted.");
    startTransition(() => {
      router.refresh();
    });
  }

  if (!authenticated) {
    return (
      <div className="panel mx-auto max-w-xl p-8 md:p-10">
        <span className="eyebrow">Admin Login</span>
        <h2 className="mt-5 font-headline text-4xl leading-tight text-primary">
          Enter the owner password to manage posts.
        </h2>
        <p className="mt-5 text-base leading-8 text-slate-600">
          This dashboard lets the owner draft, publish, update, and remove blog
          posts without editing code.
        </p>
        <form className="mt-8 space-y-4" onSubmit={handleLogin}>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
          </label>
          {error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Checking..." : "Open admin"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="panel self-start p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow">Posts</span>
            <h2 className="mt-5 font-headline text-3xl leading-tight text-primary">
              Manage the blog library
            </h2>
          </div>
          {protectedMode ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
            >
              Logout
            </button>
          ) : null}
        </div>
        {!protectedMode ? (
          <p className="mt-5 rounded-[22px] bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900">
            <code className="font-semibold">ADMIN_PASSWORD</code> is not set, so
            this admin page is currently open. Protect it before deployment.
          </p>
        ) : null}
        <button
          type="button"
          onClick={startNewPost}
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-transform hover:-translate-y-0.5"
        >
          New post
        </button>
        <div className="mt-6 space-y-3">
          {posts.map((post) => (
            <button
              key={post.slug}
              type="button"
              onClick={() => selectPost(post)}
              className={`w-full rounded-[24px] border px-4 py-4 text-left transition-colors ${
                selectedSlug === post.slug
                  ? "border-primary bg-[#eef4ff]"
                  : "border-slate-200 bg-white hover:border-primary/40"
              }`}
            >
              <p className="text-sm font-semibold text-primary">{post.title}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                {post.published ? "Published" : "Draft"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {new Date(post.date).toLocaleDateString("en-IN")}
              </p>
            </button>
          ))}
          {!posts.length ? (
            <p className="rounded-[24px] border border-dashed border-slate-300 px-4 py-6 text-sm leading-7 text-slate-600">
              No posts yet. Start with a new draft.
            </p>
          ) : null}
        </div>
      </aside>

      <section className="panel p-6 md:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">Editor</span>
            <h2 className="mt-5 font-headline text-4xl leading-tight text-primary">
              {selectedPost ? "Edit article" : "Create article"}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Use natural language, answer one search question per post, and
              keep headings clear for both students and search engines.
            </p>
          </div>
          {selectedSlug && form.published ? (
            <Link
              href={`/blog/${selectedSlug}`}
              className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
            >
              Open live page
            </Link>
          ) : null}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSave}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 block">Post title</span>
              <input
                required
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 block">Slug</span>
              <input
                type="text"
                value={form.slug}
                onChange={(event) =>
                  setForm((current) => ({ ...current, slug: event.target.value }))
                }
                placeholder="Leave blank to generate from title"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 block">Category</span>
              <input
                required
                type="text"
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 block">Publish date</span>
              <input
                required
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, date: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 block">Reading time</span>
              <input
                required
                type="text"
                value={form.readingTime}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    readingTime: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">Primary search query</span>
            <input
              required
              type="text"
              value={form.seoQuery}
              onChange={(event) =>
                setForm((current) => ({ ...current, seoQuery: event.target.value }))
              }
              placeholder="Example: CUET coaching in Munirka"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">Meta description</span>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 block">Card excerpt</span>
              <textarea
                required
                rows={4}
                value={form.excerpt}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    excerpt: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 block">Quick answer</span>
              <textarea
                required
                rows={4}
                value={form.quickAnswer}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    quickAnswer: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">
              Key takeaways
            </span>
            <textarea
              rows={4}
              value={form.takeaways}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  takeaways: event.target.value,
                }))
              }
              placeholder="Write one takeaway per line"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">Article body</span>
            <textarea
              required
              rows={18}
              value={form.body}
              onChange={(event) =>
                setForm((current) => ({ ...current, body: event.target.value }))
              }
              className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-4 font-mono text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Use `##` for section headings, blank lines between paragraphs, and
              `-` for bullet points.
            </p>
          </label>

          <label className="flex items-start gap-3 rounded-[24px] bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  published: event.target.checked,
                }))
              }
              className="mt-1 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span>
              Publish this post now. Turn this off to keep it saved as a draft
              inside the admin only.
            </span>
          </label>

          {message ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending
                ? "Saving..."
                : form.published
                  ? "Save and publish"
                  : "Save draft"}
            </button>
            {selectedSlug ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-50"
              >
                Delete post
              </button>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
