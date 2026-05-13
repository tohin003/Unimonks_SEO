type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  /** Optional id used by the admin focus scroller to deep-link into this panel. */
  id?: string;
  children: React.ReactNode;
};

export function AdminPanel({
  eyebrow,
  title,
  description,
  id,
  children,
}: Props) {
  return (
    <section id={id} className="panel space-y-5 p-6 md:p-7">
      <header>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-3 font-headline text-2xl leading-tight text-primary md:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
        ) : null}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
