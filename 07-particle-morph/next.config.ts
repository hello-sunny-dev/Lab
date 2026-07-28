import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // R3F v9 + React 19: StrictMode's dev double-mount re-runs Canvas root
  // creation and floods the console with createRoot() warnings.
  // Known upstream issue — dev-only, so StrictMode is disabled here.
  reactStrictMode: false,
};

export default nextConfig;
