import Link from "next/link";

type SectionPlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  livePath?: string;
  fields: { name: string; description: string; sample?: string }[];
};

export function SectionPlaceholder({
  eyebrow,
  title,
  description,
  livePath,
  fields,
}: SectionPlaceholderProps) {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            {description}
          </p>
        </div>
        {livePath ? (
          <Link
            href={livePath}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
          >
            Open live page
          </Link>
        ) : null}
      </header>

      <article className="panel p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Editor coming in Phase 3
        </p>
        <h2 className="mt-3 font-headline text-2xl leading-tight text-primary">
          The fields this editor will expose.
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Each field below maps to a section on the live page. When the
          editor is wired up, saving here will revalidate the matching public
          page within seconds.
        </p>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {fields.map((field) => (
            <li
              key={field.name}
              className="rounded-2xl border border-slate-200 bg-white/70 p-4"
            >
              <p className="text-sm font-semibold text-primary">{field.name}</p>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                {field.description}
              </p>
              {field.sample ? (
                <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 font-mono text-[11px] leading-5 text-slate-600">
                  {field.sample}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
