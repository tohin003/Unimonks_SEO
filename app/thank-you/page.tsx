import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thank You",
  robots: {
    index: false,
    follow: false,
  },
};

type ThankYouPageProps = {
  searchParams: Promise<{
    status?: string;
    source?: string;
  }>;
};

const statusCopy = {
  success: {
    title: "Your request has been sent.",
    description:
      "The UNIMONKS team now has your details. The next step is a counseling conversation around your exam year, target universities, and the study support you need.",
  },
  invalid: {
    title: "A few details were missing.",
    description:
      "Please go back to the form and make sure your name, phone number, email, and consent box are all filled in.",
  },
  error: {
    title: "The form could not be saved right now.",
    description:
      "Please retry in a minute or call the team directly so your request does not get delayed.",
  },
} as const;

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const resolvedSearchParams = await searchParams;
  const status =
    resolvedSearchParams.status === "invalid" ||
    resolvedSearchParams.status === "error"
      ? resolvedSearchParams.status
      : "success";
  const copy = statusCopy[status];

  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-20">
        <section className="section-shell py-16 md:py-24">
          <div className="panel mx-auto max-w-3xl p-8 md:p-12">
            <span className="eyebrow">Form Status</span>
            <h1 className="mt-6 font-headline text-4xl leading-tight text-primary md:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-600 md:text-lg">
              {copy.description}
            </p>
            <div className="mt-8 rounded-[24px] bg-[#eef4ff] p-5 text-sm leading-7 text-slate-700">
              <p>
                Source page:{" "}
                <strong className="text-primary">
                  {resolvedSearchParams.source || "website"}
                </strong>
              </p>
              <p>
                Direct contact:{" "}
                <a href={siteConfig.phoneHref} className="font-semibold text-primary">
                  {siteConfig.phoneDisplay}
                </a>{" "}
                or{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-semibold text-primary"
                >
                  {siteConfig.email}
                </a>
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/enroll#lead-form"
                className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-transform hover:-translate-y-0.5"
              >
                Open the counseling form again
              </Link>
              <Link
                href="/hub"
                className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
              >
                Keep reading study resources
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
