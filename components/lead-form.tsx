import { programs } from "@/lib/site";

type LeadFormProps = {
  formId?: string;
  title: string;
  description: string;
  submitLabel: string;
  source: string;
  redirectTo?: string;
  tone?: "light" | "dark";
};

export function LeadForm({
  formId = "lead-form",
  title,
  description,
  submitLabel,
  source,
  redirectTo = "/thank-you",
  tone = "light",
}: LeadFormProps) {
  const isDark = tone === "dark";
  const cardClass = isDark
    ? "rounded-[28px] border border-white/10 bg-slate-950 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.8)]"
    : "rounded-[28px] border border-slate-200/80 bg-white/90 text-slate-900 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]";
  const inputClass = isDark
    ? "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-[#9ec5ff] focus:outline-none focus:ring-2 focus:ring-[#9ec5ff]/20"
    : "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10";

  return (
    <section id={formId} className={`${cardClass} p-6 md:p-8`}>
      <div className="space-y-3">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${
            isDark
              ? "bg-white/10 text-slate-200"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Free Counseling
        </span>
        <h2 className="font-headline text-3xl leading-tight md:text-4xl">
          {title}
        </h2>
        <p
          className={`text-sm leading-7 ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      </div>
      <form action="/api/leads" method="post" className="mt-8 space-y-4">
        <input type="hidden" name="source" value={source} />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">
            <span className="mb-2 block">Full name</span>
            <input
              required
              type="text"
              name="fullName"
              autoComplete="name"
              placeholder="Student name"
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium">
            <span className="mb-2 block">Phone number</span>
            <input
              required
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder="+91"
              className={inputClass}
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">
            <span className="mb-2 block">Email</span>
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium">
            <span className="mb-2 block">Exam year</span>
            <select name="examYear" className={inputClass} defaultValue="2026">
              <option value="2026">CUET 2026</option>
              <option value="2027">CUET 2027</option>
              <option value="2028">CUET 2028</option>
              <option value="PG">CUET PG</option>
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          <span className="mb-2 block">What are you interested in?</span>
          <select name="targetCourse" className={inputClass} defaultValue="">
            <option value="" disabled>
              Select a track
            </option>
            {programs.map((program) => (
              <option key={program.name} value={program.name}>
                {program.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          <span className="mb-2 block">What do you need help with?</span>
          <textarea
            name="message"
            rows={4}
            placeholder="GT, English, domain subjects, admissions guidance, or all of the above."
            className={inputClass}
          />
        </label>
        <label
          className={`flex items-start gap-3 rounded-2xl px-1 text-sm leading-6 ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          <input
            required
            type="checkbox"
            name="consent"
            value="yes"
            className="mt-1 rounded border-slate-300 text-primary focus:ring-primary"
          />
          <span>
            I agree to be contacted by the UNIMONKS team about coaching,
            counseling, and admissions support.
          </span>
        </label>
        <button
          type="submit"
          className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
            isDark
              ? "bg-white text-slate-950"
              : "bg-primary text-on-primary"
          }`}
        >
          {submitLabel}
        </button>
      </form>
    </section>
  );
}
