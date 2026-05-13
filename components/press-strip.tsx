import { getPressMentions } from "@/lib/content/press";

type PressStripProps = {
  variant?: "standalone" | "panel";
  eyebrow?: string;
  heading?: string;
};

export async function PressStrip({
  variant = "standalone",
  eyebrow = "Featured in",
  heading = "UNIMONKS in national press",
}: PressStripProps) {
  const pressMentions = await getPressMentions();
  const wrapperClass =
    variant === "panel"
      ? "panel p-6 md:p-8"
      : "rounded-[28px] border border-slate-200/80 bg-white/70 p-6 md:p-8";

  return (
    <div className={wrapperClass}>
      <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-primary">
            {heading}
          </p>
        </div>
        <p className="text-sm leading-6 text-slate-500 md:max-w-xs md:text-right">
          National coverage referencing UNIMONKS coaching work in Munirka and
          South Delhi.
        </p>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {pressMentions.map((mention) => {
          const content = (
            <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary">
              {mention.publication}
            </div>
          );

          return (
            <li key={mention.publication}>
              {mention.url ? (
                <a
                  href={mention.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Read ${mention.publication} coverage of UNIMONKS`}
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
