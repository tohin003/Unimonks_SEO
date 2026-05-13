import type { NextConfig } from "next";

function r2RemotePattern() {
  const raw = process.env.R2_PUBLIC_BASE_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return {
      protocol: (url.protocol.replace(":", "") as "http" | "https") ?? "https",
      hostname: url.hostname,
      port: url.port || "",
      pathname: `${url.pathname.replace(/\/+$/, "")}/**`,
      search: "",
    };
  } catch {
    return null;
  }
}

const remotePatterns = [r2RemotePattern()].filter(
  (p): p is NonNullable<ReturnType<typeof r2RemotePattern>> => p !== null,
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
