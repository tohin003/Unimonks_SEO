import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

type LogoProps = {
  className?: string;
  href?: string;
  showTagline?: boolean;
};

export function Logo({
  className = "",
  href = "/",
  showTagline = false,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 ${className}`.trim()}
    >
      <Image
        src="/unimonks-logo.png"
        alt={`${siteConfig.name} logo`}
        width={200}
        height={200}
        className="h-11 w-11 rounded-2xl object-contain"
        priority
      />
      <span className="flex flex-col">
        <span className="font-headline text-xl italic tracking-tight text-primary">
          {siteConfig.name}
        </span>
        {showTagline ? (
          <span className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            {siteConfig.tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
